import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RedisService } from 'src/redis/services/redis.service';
import generateStatus from 'src/shared/func/generate-status';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly _redis: RedisService) {}

  use(req: any, res: Response, next: NextFunction) {
    // Control Servicio Autenticación

    //Obtener el cliente de redis Inyectado por dependencia
    const redisClient = this._redis.getConnection();
    const cookies = req.cookies;

    const authHeader = cookies?.azulkSessionID;

    if (!authHeader) {
      return res
        .status(401)
        .json(
          generateStatus({
            type: 'error',
            status: 'missing azulkSessionID',
            code: '99',
          }),
        )
        .end();
    }

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
          res
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
        res.status(401).json({ status: e.toString() }).end();
      });

    next();
  }
}
