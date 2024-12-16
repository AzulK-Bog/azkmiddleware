import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import generateStatus from 'src/shared/func/generate-status';
import { getUserInfo } from 'src/shared/func/get-user-info';
import { updateUserPushToken } from 'src/shared/func/update-user-push-token';
import { updateUserWebSocketToken } from 'src/shared/func/update-user-web-socket-token';
@Injectable()
export class PingService {
  constructor() {}

  ping() {
    return generateStatus({});
  }

  updateWebPushTkn(req: Request, res: Response) {
    return updateUserPushToken(req, res);
  }

  updateUserPushToken(req: Request, res: Response) {
    return updateUserWebSocketToken(req, res);
  }

  getUserInfo(req: Request, res: Response) {
    return getUserInfo(req, res);
  }
}
