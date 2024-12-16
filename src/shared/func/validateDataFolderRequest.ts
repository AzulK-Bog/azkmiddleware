import { downloadFolderTypes } from './dowloadFolder';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export function validateInputData(data: downloadFolderTypes) {
  const { dstPath, host, passphrase, port, privateKey, srcPath, user } = data;

  const response = { status: 'OK', code: 0 };

  if (!host || host.trim() === '') {
    response.code = 8;
    response.status = 'Host es requerido';
    return response;
  }

  if (!port || port.toString().trim() === '') {
    response.code = 8;
    response.status = 'Port requerido';
    return response;
  }

  if (!user || user.trim() === '') {
    response.code = 8;
    response.status = 'User requerido';
    return response;
  }

  if (!passphrase || passphrase.trim() === '') {
    response.code = 8;
    response.status = 'Passphrase requerido';
    return response;
  }

  if (!srcPath || srcPath.trim() === '') {
    response.code = 8;
    response.status = 'srcPath requerido';
    return response;
  }

  if (!dstPath || dstPath.trim() === '') {
    response.code = 8;
    response.status = 'dstPath requerido';
    return response;
  }

  if (!privateKey || privateKey.trim() === '') {
    response.code = 8;
    response.status = 'privateKey requerido';
    return response;
  }

  // See if the file exists
  if (!fs.existsSync(privateKey)) {
    response.code = 8;
    response.status = `privateKey ${privateKey} no encontrada`;
    return response;
  }
  return response;
}
