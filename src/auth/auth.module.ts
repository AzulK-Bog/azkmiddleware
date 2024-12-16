import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './interfaces/auth.controller';
import { RedisModule } from 'src/redis/redis.module';
import { PingService } from './services/ping.service';
import { PingController } from './interfaces/ping.controller';
import { EXCLUDE_ROUTES } from 'src/shared/constants/exclude.routes';
import autentica from 'src/shared/func/autentica';

@Module({
  imports: [RedisModule],
  controllers: [AuthController, PingController],
  providers: [AuthService, PingService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(autentica)
      .exclude(...EXCLUDE_ROUTES)
      .forRoutes('*');
  }
}
