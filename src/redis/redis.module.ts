import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './services/redis.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
