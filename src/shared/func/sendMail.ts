import nodemailer from 'nodemailer';

async function sendMail(request: any) {
  const response = { status: 'OK', code: 0, data: null };
  const sendTo = [];
  const sendCC = [];
  const sendBCC = [];
  const attachments = [];

  request.dsSendMail.eeMail[0]?.recipients?.forEach((e) => {
    if (e?.etype === 'TO') {
      sendTo.push(e?.mail);
    }
    if (e?.etype === 'CC') {
      sendCC.push(e?.mail);
    }
    if (e?.etype === 'sendBCC') {
      sendBCC.push(e?.mail);
    }
  });

  request.dsSendMail.eeMail[0]?.attachments?.forEach((e) => {
    if (e?.ename && e?.path)
      attachments.push({
        filename: e?.ename,
        path: e?.path, // stream this file});
      });
  });

  try {
    const transporter = nodemailer.createTransport({
      host: request.dsSendMail.eeMail[0].host,
      port: request.dsSendMail.eeMail[0].port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: request.dsSendMail.eeMail[0].efrom, // generated ethereal user
        pass: request.dsSendMail.eeMail[0].password, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: {
        name: request.dsSendMail.eeMail[0].ealias,
        address: request.dsSendMail.eeMail[0].efrom,
      },
      to: sendTo,
      cc: sendCC,
      bcc: sendBCC,
      attachments: attachments,
      subject: request.dsSendMail.eeMail[0].subject, // Subject line
      html: request.dsSendMail.eeMail[0].body, // plain text body
    });

    console.log('Message sent: %s', info.messageId);

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log('En el catch ', error);
    response.code = 8;
    response.status = error;
  }

  return response;
}

export { sendMail };
