import generateStatus from 'src/shared/func/generate-status';
import { getGeneralQueue } from 'src/shared/func/getGeneralQueue';
import { validateEmailData } from 'src/shared/func/validateEmailAnDataRequest';

async function addMQJob(req: any, res: any) {
  try {
    const jobType = req.query.jobType;

    switch (jobType) {
      case 'sendEmail':
        const { status, code } = await validateEmailData({ request: req.body });
        if (status !== 'OK') {
          res
            .status(500)
            .json(generateStatus({ type: 'error', status: status, code: code }))
            .end();
          return;
        }
        await getGeneralQueue().add('sendEmail', req.body, {
          removeOnComplete: {
            age: 3600, // keep up to 1 hour
            count: 1000, // keep up to 1000 jobs
          },
          removeOnFail: {
            age: 24 * 3600, // keep up to 24 hours
          },
        });
        break;

      default:
        res
          .status(500)
          .json(
            generateStatus({
              type: 'error',
              status: `jobType ${jobType ?? ''} not allowed`,
              code: '99',
            }),
          )
          .end();
        break;
    }

    res.json(generateStatus({})).end();
  } catch (error) {
    res
      .status(500)
      .json(
        generateStatus({ type: 'error', status: error.message, code: '99' }),
      )
      .end();
  }
}

export { addMQJob };
