import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { initSwagger } from './configuration/utilities/swagger';

import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import autentica from './shared/func/autentica';
import { CustomRequest } from './shared/models/custom-request-model';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import {
  downloadFolderController,
  listFiles,
} from './express-custom-controllers/sftp.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  const _config = app.get(ConfigService);
  const routeToProxy = _config.get<string>('backendProxy');
  const routeToNodeRed = _config.get<string>('nodeRedProxy');
  const routeToUtils = _config.get<string>('backendUtilsProxy');
  // Crear una instancia de Express
  const expressApp = app.getHttpAdapter().getInstance();
  const expressRouter = express.Router();

  // const whitelistOrigins: string[] = _config.get<string>(
  //   'corsWhiteList',
  // ) as unknown as string[];

  // app.use('azulk/web/authstatic/*', () => {
  //   console.log('authstatic');
  // });

  //expressApp.use(express.json());

  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4200/*',
      'http://localhost:4080',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4173',
      'https://apps.azulk.co/',
      'https://pruebas.azulk.co/',
      'undefined',
    ],
    methods: '*',
    credentials: true,
    optionsSuccessStatus: 200,
  });
  app.setGlobalPrefix(_config.get<string>('applicationGlobalPrefix'));

  expressApp.use(
    '/azulk/web/authstatic',
    autentica,
    express.static(_config.get<string>('applicationTempFolder')),
  );

  expressApp.use(
    '/internal/sftp',
    express.json({ limit: '1gb' }),
    expressRouter.post('/downloadFolder', (req, res) => {
      downloadFolderController(req, res);
    }),
  );

  expressApp.use(
    '/internal/sftp',
    express.json({ limit: '1gb' }),
    expressRouter.get('/listFiles', (req, res) => {
      listFiles(req, res);
    }),
  );

  expressApp.use(
    '/internal/mq',
    express.json({ limit: '1gb' }),
    expressRouter.post('/addMQJob', (req, res) => {
      listFiles(req, res);
    }),
  );

  const proxyReqPathResolverProxyDocsBody = (req) => {
    const parts = req.url.split('?');
    const queryString = parts[1];
    const updatedPath = parts[0].replace('/azulk/web/proxydocs/body', '');
    //console.log("/azulk/web/proxydocs/body", updatedPath + (queryString ? "?" + queryString : ""));
    return updatedPath + (queryString ? '?' + queryString : '');
  };

  const proxyMiddlewareProxyDocsBody = createProxyMiddleware({
    target: routeToUtils,
    changeOrigin: true,
    onProxyReq: function (proxyReq, req: CustomRequest) {
      proxyReq.setHeader('userName', req.jwtInfo?.userName ?? 'generic');
      proxyReq.setHeader('userId', req.jwtInfo?.userId ?? 'generic');
      proxyReq.setHeader('userNomina', req.jwtInfo?.userNomina ?? 'generic');
      proxyReq.setHeader('email', req.jwtInfo?.email ?? 'generic');
      const parts = req.url.split('?');
      const queryString = parts[1];
      const updatedPath = parts[0].replace('/azulk/web/proxydocs/body', '');
      //console.log("/azulk/web/proxydocs", updatedPath + (queryString ? "?" + queryString : ""));
      return updatedPath + (queryString ? '?' + queryString : '');
    },
    onError: function (err, req, res) {
      console.log('proxyErrorHandler:', err);
      res.status(500).send('Error en el proxy');
    },
  });

  app.use('/azulk/web/proxydocs/body', autentica, (req, res, next) => {
    req.url = proxyReqPathResolverProxyDocsBody(req);
    proxyMiddlewareProxyDocsBody(req, res, next);
  });

  const proxyReqPathResolverProxyDocs = (req) => {
    const parts = req.url.split('?');
    const queryString = parts[1];
    const updatedPath = parts[0].replace('/azulk/web/proxydocs', '');
    return updatedPath + (queryString ? '?' + queryString : '');
  };

  // Middleware de proxy
  const proxyMiddleware = createProxyMiddleware({
    target: routeToUtils,
    changeOrigin: true,
    pathRewrite: {
      '^/azulk/web/proxydocs': '',
    },
    onProxyReq: (proxyReq, req: CustomRequest) => {
      proxyReq.setHeader('userName', req.jwtInfo.userName);
      proxyReq.setHeader('userId', req.jwtInfo.userId);
      proxyReq.setHeader('userNomina', req.jwtInfo.userNomina);
      proxyReq.setHeader('email', req.jwtInfo.email);
    },
    onError: (err, req, res) => {
      console.log('proxyErrorHandler:', err);
      res.status(500).send('Proxy Error');
    },
  });

  app.use('/azulk/web/proxydocs', autentica, (req, res, next) => {
    req.url = proxyReqPathResolverProxyDocs(req);
    proxyMiddleware(req, res, next);
  });

  app.use(
    '/azulk/web',
    autentica,
    createProxyMiddleware({
      target: routeToProxy,
      changeOrigin: true,
      onProxyReq: (proxyReq, req: CustomRequest) => {
        const jwtInfo = req?.jwtInfo;
        proxyReq.setHeader('userName', jwtInfo?.userName ?? 'generic');
        proxyReq.setHeader('userId', jwtInfo?.userId ?? 'generic');
        proxyReq.setHeader('userNomina', jwtInfo?.userNomina ?? 'generic');
        proxyReq.setHeader('email', jwtInfo?.email ?? 'generic');
      },
    }),
  );

  app.use(
    '/ui',
    autentica,
    createProxyMiddleware({
      target: routeToNodeRed,
      changeOrigin: true,
      onProxyReq: (proxyReq, req: CustomRequest) => {
        const parts = req.url.split('?');
        const queryString = parts[1];
        const updatedPath = parts[0];
        return `/ui${updatedPath}${queryString ? `?${queryString}` : ''}`;
      },
      onError: (err, req, res) => {
        console.error('Error en el proxy', err);
        res.status(500).send('Error en el proxy');
      },
    }),
  );

  initSwagger(app);
  await app.listen(AppModule.PORT);
}
bootstrap();
