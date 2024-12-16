import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty()
  user?: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  remember?: boolean;
}

export interface Authinterface {
  status?: string;
  code?: number;
  data?: any;
}

export interface UserInfo {
  userId?: string;
  userName?: string;
  userNomina?: string;
  email?: string;
  expire?: string;
}
