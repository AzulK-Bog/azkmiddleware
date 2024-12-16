import { validateInputData } from './validateDataFolderRequest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Client = require('ssh2-sftp-client');
const sftp = new Client();

export interface downloadFolderTypes {
  host?: string;
  port?: number;
  user?: string;
  passphrase?: string;
  privateKey?: string;
  srcPath?: string;
  dstPath?: string;
}

export async function downloadFolder({
  dstPath,
  host,
  passphrase,
  port,
  privateKey,
  srcPath,
  user,
}: downloadFolderTypes) {
  const response = { status: 'OK', code: 0, data: null };
  const filesDownloaded = [];
  const { status: valStatus, code: valCode } = await validateInputData({
    host: host,
    port: port,
    user: user,
    passphrase: passphrase,
    privateKey: privateKey,
    srcPath: srcPath,
    dstPath: dstPath,
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
    const files = await sftp.list(srcPath);

    console.log(`STARTING DOWNLOAD PROCESS AT ${new Date()}`);

    for await (const file of files) {
      if (!file.name.startsWith('.')) {
        console.log(
          `  -> STARTING: downloading file: ${srcPath}${file.name} to ${dstPath}/${file.name}`,
        );
        await sftp.get(`${srcPath}${file.name}`, `${dstPath}/${file.name}`);
        console.log(
          `  <- COMPLETE: download of file: ${dstPath}/${file.name} complete`,
        );

        filesDownloaded.push({
          eeFileName: file.name,
          eeFilePath: `${dstPath}/${file.name}`,
        });
      }
    }

    response.data = filesDownloaded;
    console.log(`FINISHING DOWNLOAD PROCESS AT ${new Date()}`);
  } catch (error) {
    response.status = error.toString();
    response.code = 8;
  } finally {
    sftp?.end();
  }

  return response;
}
