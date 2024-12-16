import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Auth } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import generateStatus from 'src/shared/func/generate-status';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  //@ApiOkResponse({ type: UserLoginDto })
  @Post('login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: Auth,
  ): Promise<any> {
    try {
      const res = await this._auth.signIn(request, loginDto);
      if (res.genStatus.response.status.status !== 'OK')
        return response.status(401).json(res.genStatus);
      return response
        .setHeader(
          'Content-Security-Policy',
          "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'nonce-random123' 'strict-dynamic' 'unsafe-inline' https:; style-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; report-uri https://reporting.example.com;",
        )
        .status(200)
        .cookie('azulkSessionID', res.userKey, {
          httpOnly: true,
          maxAge: 9999 * 6000 * 6000 * 9999,
        })
        .json(res.genStatus)
        .end();
    } catch (error) {
      console.log(error);
      return response
        .status(401)
        .json(
          generateStatus({
            type: 'error',
            status: error?.message,
            code: 99,
          }),
        )
        .end();
    }
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      await this._auth.Logout(request, response);
      return response.end();
    } catch (error) {
      return response.status(401).json(error).end();
    }
  }
}
