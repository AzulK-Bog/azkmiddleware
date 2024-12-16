import { downloadFolderTypes } from './dowloadFolder';
import { validateInputData } from './validateDataFolderRequest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Client = require('ssh2-sftp-client');
const sftp = new Client();

async function listFolders(data: downloadFolderTypes) {
  const { host, passphrase, port, privateKey, srcPath, user } = data;
  const response = { status: 'OK', code: 0, data: null };

  const { status: valStatus, code: valCode } = await validateInputData({
    host: host,
    port: port,
    user: user,
    passphrase: passphrase,
    privateKey: privateKey,
    srcPath: srcPath,
    dstPath: 'not required',
  });

  if (valStatus !== 'OK') {
    response.status = valStatus;
    response.code = valCode;
    return response;
  }
  try {
    await sftp.connect({
      host: host,
      port: port,
      username: user,
      passphrase: passphrase,
      privateKey: fs.readFileSync(privateKey, 'utf8'),
    });

    const list = await sftp.list(srcPath);
    response.data = list;
  } catch (error) {
    response.status = error.toString();
    response.code = 8;
  } finally {
    sftp?.end();
  }

  return response;
}

export { listFolders };
