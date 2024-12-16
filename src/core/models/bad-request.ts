import { ApiProperty } from '@nestjs/swagger';

export class BadRequest {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  timestamp: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
  @ApiProperty()
  path: string;
}
