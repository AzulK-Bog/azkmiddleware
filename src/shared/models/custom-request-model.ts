import { Request } from 'express';

export interface CustomRequest extends Request {
  jwtInfo?: {
    userName?: string;
    userId?: string;
    userNomina?: string;
    email?: string;
    d;
  };
}
