import { ConfigService } from '@nestjs/config';
import generateStatus from './generate-status';
import { RedisService } from 'src/redis/services/redis.service';

const configService = new ConfigService();
const redisService = new RedisService(configService);

export const updateUserWebSocketToken = async (req, res) => {
  const client = redisService.getConnection();
  const authHeader = req.cookies.azulkSessionID;

  if (!req.body?.token || req.body?.token?.toString() === '') {
    res
      .status(401)
      .json(
        generateStatus({
          type: 'error',
          status: 'Web Push Token not specified',
          code: '99',
        }),
      )
      .end();

    return;
  }

  const jwtInfo = {
    userId: '',
    userName: '',
    userNomina: '',
    email: '',
    pushToken: '',
    socketToken: '',
  };

  client
    .hgetall(authHeader)
    .then((e) => {
      if (Object.keys(e).length !== 0) {
        jwtInfo.userId = e?.userId?.toString();
        jwtInfo.userName = e?.userName?.toString();
        jwtInfo.userNomina = e?.userNomina?.toString();
        jwtInfo.email = e?.email?.toString();
        jwtInfo.pushToken = e?.pushToken ? e?.pushToken?.toString() : '';
        jwtInfo.socketToken = req.body.token.toString();

        client.hset(authHeader, jwtInfo);
        res.json(generateStatus({})).end();
      } else {
        res
          .status(401)
          .json(
            generateStatus({
              type: 'error',
              status: 'Token no encontrado',
              code: '99',
            }),
          )
          .end();
      }
    })
    .catch((e) => {
      console.log('ERROR autentica catch e:', e);
      res.status(401).json({ status: e.toString() }).end();
    });
};
