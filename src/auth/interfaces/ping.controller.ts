import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Token } from '../models/token';
import { PingService } from '../services/ping.service';

@ApiTags('Auth')
@Controller('')
export class PingController {
  constructor(private readonly _ping: PingService) {}

  @Post('ping')
  @HttpCode(200)
  async ping(@Res() response: Response): Promise<any> {
    try {
      const res = await this._ping.ping();
      return response.json(res).end();
    } catch (error) {
      return response.status(500).json(error).end();
    }
  }

  @Post('updateWebSocketTkn')
  @HttpCode(200)
  async updateWebPushTkn(
    @Body() body: Token,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this._ping.updateWebPushTkn(request, response);
    } catch (error) {
      //return response.status(500).json(error).end();
    }
  }

  @Post('updateWebPushTkn')
  @HttpCode(200)
  async updateUserPushToken(
    @Body() body: Token,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this._ping.updateUserPushToken(request, response);
    } catch (error) {
      //return response.status(500).json(error).end();
    }
  }
}
