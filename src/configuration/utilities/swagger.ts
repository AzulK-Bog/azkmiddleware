import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Api Documentation AZULK Swagger')
    .setDescription('Documentation of api of AzulK')
    .setVersion('0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
};
