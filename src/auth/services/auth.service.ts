import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { authenticate } from 'ldap-authentication';
import { RedisService } from 'src/redis/services/redis.service';
import generateStatus from 'src/shared/func/generate-status';
import { ttStatusResponseModed } from 'src/shared/models/ttStatus.model';
import { Auth, Authinterface, UserInfo } from '../models/auth.model';
@Injectable()
export class AuthService {
  constructor(private readonly _redis: RedisService) {}

  async signIn(
    request: Request,
    dataSign: Auth,
  ): Promise<ttStatusResponseModed> {
    try {
      const uuid = randomUUID();
      const redisClient = await this.getRedisConnection();
      const { user, password, remember } = dataSign;
      const { code, status, data } = await this.getLdapAuth({
        user,
        password,
        remember,
      });

      if (status !== 'OK')
        return {
          userKey: '',
          genStatus: generateStatus({ code, status }),
        };

      const userInfo: UserInfo = {
        userId: data.sAMAccountName,
        userName: data.name,
        userNomina: data.initials ?? '',
        email: data.mail,
        expire: dataSign?.remember?.toString() === 'true' ? 'true' : 'false',
      };

      const userKey = `${data.sAMAccountName}:${
        request.headers.host.split(':')[0]
      }:${uuid}`;

      await redisClient.hset(userKey, userInfo);

      if (userInfo.expire === 'true') {
        //expira en 1 hora
        console.log('expira en 1 hora');
        redisClient.expire(userKey, '3600');
      }

      const result = generateStatus({
        data: { userId: data.sAMAccountName, email: data.mail },
      });

      return { userKey, genStatus: result };
    } catch (error) {
      return {
        userKey: '',
        genStatus: generateStatus({ code: 99, status: error }),
      };
    }
  }

  Logout = async (req, res) => {
    try {
      const client = await this.getRedisConnection();
      const cookies = req.cookies;
      if (!cookies.azulkSessionID)
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

      const authHeader = cookies.azulkSessionID;

      if (!authHeader)
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

      console.log(authHeader); //Bearer token

      client.del(authHeader);

      res.clearCookie('azulkSessionID').json(generateStatus({})).end();
    } catch (error) {
      res
        .status(401)
        .json(
          generateStatus({ type: 'error', status: error.message, code: '99' }),
        )
        .end();
    }
  };

  async getRedisConnection(): Promise<Redis> {
    return await this._redis.getConnection();
  }

  async getLdapAuth(data: Auth): Promise<Authinterface> {
    const response = { status: 'OK', code: 0, data: null };
    const { user, password } = data;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!user || user.toString().trim() === '') {
      response.code = 8;
      response.status = 'Id de usuario requerido';
      return response;
    }

    if (
      !password ||
      (password.toString().trim() === '' && !password) ||
      password.toString().trim() === ''
    ) {
      response.code = 8;
      response.status = 'Clave de usuario requerida';
      return response;
    }

    let userMail, userId, userNomCod;
    if (user.match(validRegex)) {
      userMail = user;
    } else if (user.length <= 6 && user?.toUpperCase()?.startsWith('E')) {
      userNomCod = user;
    } else {
      userId = user;
    }

    const determineAttr = () => {
      if (userMail) return 'mail';
      if (userId) return 'sAMAccountName';
      if (userNomCod) return 'initials';
    };

    const options = {
      ldapOpts: {
        url: 'ldap://AZULKBOG.azulk.com.co:389/',
      },
      adminDn:
        'CN=SISTEMAS,OU=Sistemas,OU=AzulK Usuarios,DC=AZULKBOG,DC=azulk,DC=com,DC=co',
      adminPassword: '2014sys*',
      userPassword: password,
      userSearchBase: 'DC=AZULKBOG,DC=azulk,DC=com,DC=co',
      usernameAttribute: determineAttr(),
      username: userMail || userId || userNomCod,
      groupsSearchBase:
        'CN=Usuarios Portal Apps,OU=AzulK Grupos,DC=AZULKBOG,DC=azulk,DC=com,DC=co',
    };

    try {
      const userFound = await authenticate(options);

      if (userFound) {
        /*(if (!userFound.mail) {
          response.code = 8;
          response.status = `Usuario ${userFound?.sAMAccountName} no tiene correo asignado, contacte con el administrador del sistema para que sea asignado`;
          return response;
        }*/
        if (
          !userFound.memberOf.includes(
            'CN=Usuarios Portal Apps,OU=AzulK Grupos,DC=AZULKBOG,DC=azulk,DC=com,DC=co',
          )
        ) {
          response.code = 8;
          response.status =
            'No permitido por políticas de grupo, contacte al administrador del sistema';
          return response;
        }

        const allowedUserAccountControls = ['544', '66048', '262656', '512'];
        if (
          !allowedUserAccountControls.includes(userFound?.userAccountControl)
        ) {
          response.code = 8;
          response.status = 'Usuario inactivo';
        } else {
          response.data = userFound;
        }
      }
    } catch (error) {
      if (
        error?.lde_message?.startsWith('80090308') ||
        error
          ?.toString()
          ?.match(/user not found or usernameAttribute is wrong/g)
      ) {
        response.code = 8;
        response.status = 'Usuario o clave incorrectos';
      } else {
        response.code = 8;
        response.status = error;
      }
    }

    return response;
  }
}
