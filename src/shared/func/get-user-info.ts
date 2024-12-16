import { RedisService } from 'src/redis/services/redis.service';
import generateStatus from './generate-status';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const redisService = new RedisService(configService);

export const getUserInfo = async (req, res) => {
  const client = redisService.getConnection();

  if (!req.body?.userid || req.body?.userid?.toString() === '') {
    res
      .status(401)
      .json(
        generateStatus({
          type: 'error',
          status: 'Usuario a consultar no especificado',
          code: '99',
        }),
      )
      .end();
    return;
  }

  const prueba = await client.keys(
    `${req.body?.userid}:${req.headers.host.split(':')[0]}:*`,
  );

  if (prueba?.length > 1) {
    const testdata = await client.hgetall(prueba[0]);
    console.log(testdata);
  }

  res.end('OK');
};
