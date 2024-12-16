import { NestMiddleware } from '@nestjs/common';

//@Injectable()
export class NotFoundHandlerMiddleware implements NestMiddleware {
  constructor() {}

  use = () => {
    // console.log('req', req);
    // res.status(404);
    // if (req.accepts('html')) {
    //   res.sendFile(path?.join(__dirname, '..', 'views', '404.html'));
    // } else if (req.accepts('application/json')) {
    //   let rstatus: ttStatus;
    //   rstatus.code = 0;
    //   rstatus.status = '404 Not Found';
    //   rstatus.type = 'error';
    //   res.json(rstatus);
    // } else {
    //   res.type('txt').send('404 Not Found');
    // }
    // next();
  };
}
