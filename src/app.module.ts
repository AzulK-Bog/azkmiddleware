import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigurationModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        express.json({ limit: '1gb' }),
        express.urlencoded({ extended: true }),
      )
      .forRoutes('*');
  }
  static PORT: number;
  constructor(private readonly _config: ConfigService) {
    AppModule.PORT = this._config.get<number>('applicationPort');
  }
}
