import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/services/redis.service';
import generateStatus from './generate-status';

const configService = new ConfigService();
const redisService = new RedisService(configService);
const notSecuredRoutes = configService.get<any>('applicationNotSecuredPaths');

const autentica = (req, resp, next) => {
  const cookies = req.cookies;
  const redisClient = redisService.getConnection();
  const notSecured = JSON.parse(notSecuredRoutes);
  if (notSecured?.some((ruta) => req.originalUrl.match(ruta))) {
    req.jwtInfo = {
      userId: 'generic',
      userName: 'generic',
      userNomina: 'generic',
      email: 'generic',
    };
    next();
  } else {
    if (!cookies.azulkSessionID)
      return resp
        .status(401)
        .json(
          generateStatus({
            type: 'error',
            status: 'missing azulkSessionID',
            code: '99',
          }),
        )
        .end();

    const authHeader = cookies.azulkSessionID;

    if (!authHeader)
      return resp
        .status(401)
        .json(
          generateStatus({
            type: 'error',
            status: 'missing azulkSessionID',
            code: '99',
          }),
        )
        .end();

    redisClient
      .hgetall(authHeader)
      .then((e) => {
        if (Object.keys(e).length !== 0) {
          req.jwtInfo = {
            userId: e?.userId?.toString(),
            userName: e?.userName?.toString(),
            userNomina: e?.userNomina?.toString(),
            email: e?.email?.toString(),
          };

          if (req.path !== '/ping' && e?.expire === 'true')
            redisClient.expire(authHeader, 3600);
          next();
        } else {
          resp
            .status(401)
            .json(
              generateStatus({
                type: 'error',
                status: 'No autenticado',
                code: '99',
              }),
            )
            .end();
        }
      })
      .catch((e) => {
        console.log('ERROR autentica catch e:', e);
        resp.status(401).json({ status: e.toString() }).end();
      });
  }
};

export default autentica;
