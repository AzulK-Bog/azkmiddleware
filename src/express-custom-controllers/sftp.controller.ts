import { downloadFolder } from 'src/shared/func/dowloadFolder';
import generateStatus from 'src/shared/func/generate-status';
import { listFolders } from 'src/shared/func/listFotders';

async function downloadFolderController(req: any, res: any) {
  try {
    const { status, code, data } = await downloadFolder({
      host: req.body?.host,
      port: req.body?.port,
      user: req.body?.user,
      passphrase: req.body?.passphrase,
      privateKey: req.body?.privateKey,
      srcPath: req.body?.srcPath,
      dstPath: req.body?.dstPath,
    });

    if (status !== 'OK') {
      res
        .status(500)
        .json(generateStatus({ type: 'error', status: status, code: code }))
        .end();
      return;
    }

    res.json(generateStatus({ data: { eeTempFileSystemFile: data } })).end();
  } catch (error) {
    res
      .status(500)
      .json(
        generateStatus({ type: 'error', status: error.message, code: '99' }),
      )
      .end();
  }
}

async function listFiles(req: any, res: any) {
  try {
    const { status, code, data } = await listFolders({
      host: req.body?.host,
      port: req.body?.port,
      user: req.body?.user,
      passphrase: req.body?.passphrase,
      privateKey: req.body?.privateKey,
      srcPath: req.body?.srcPath,
      dstPath: req.body?.dstPath,
    });

    if (status !== 'OK') {
      res
        .status(500)
        .json(generateStatus({ type: 'error', status: status, code: code }))
        .end();
      return;
    }

    res.json(generateStatus({ data: data })).end();
  } catch (error) {
    res
      .status(500)
      .json(
        generateStatus({ type: 'error', status: error.message, code: '99' }),
      )
      .end();
  }
}

export { downloadFolderController, listFiles };
