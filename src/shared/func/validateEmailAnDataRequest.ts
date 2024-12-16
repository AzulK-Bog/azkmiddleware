import fs from 'fs';

function validateEmailData(request: any) {
  const response = { status: 'OK', code: 0, data: null };
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  try {
    if (!request.dsSendMail) {
      response.status = 'Nodo dsSendMail es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.recipients) {
      response.status = 'Nodo recipients es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.efrom) {
      response.status = 'efrom es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.password) {
      response.status = 'password es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.ealias) {
      response.status = 'ealias es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.host) {
      response.status = 'host es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.port) {
      response.status = 'host es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.body) {
      response.status = 'body es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.recipients[0]?.etype) {
      response.status = 'eeMail[0]?.recipients[0]?.etype es requerido';
      response.code = 8;
      return response;
    }

    if (!request.dsSendMail.eeMail[0]?.recipients[0]?.mail) {
      response.status = 'eeMail[0]?.recipients[0]?.etype es requerido';
      response.code = 8;
      return response;
    }

    request.dsSendMail.eeMail[0]?.recipients?.forEach((e) => {
      if (!e.mail.match(validRegex)) {
        response.status = `Correo ${e.mail} no valido`;
        response.code = 8;
        return response;
      }
    });

    request.dsSendMail.eeMail[0]?.attachments?.forEach((e) => {
      if (!e.path.startsWith('http') && !fs.existsSync(e.path)) {
        response.status = `Archivo ${e.path} no encontrado`;
        response.code = 8;
        return response;
      }
    });
  } catch (error) {
    console.log('En el catch ', error);
    response.code = 8;
    response.status = error;
  }

  return response;
}

export { validateEmailData };
