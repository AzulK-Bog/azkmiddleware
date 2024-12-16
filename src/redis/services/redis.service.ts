// redis.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('dbRedisHost'),
      port: this.configService.get('dbRedisPort'),
      password: this.configService.get('dbRedisPassword'),
    });

    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
  }

  getConnection(): Redis {
    return this.redisClient;
  }
}
