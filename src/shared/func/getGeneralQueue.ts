import { Queue, Worker } from 'bullmq';
import { sendMail } from './sendMail';

const generalQueue = new Queue('generalQueue', {
  connection: {
    port: parseInt(process.env.dbRedisPort, 10) || 6379, // Redis port
    host: process.env.dbRedisHost || 'localhost', // Redis host
    password: process.env.dbRedisPassword || '',
    db: 2, // Defaults to 0
  },
});

const generalWorker = new Worker(
  'generalQueue',
  async (job) => {
    switch (job.name) {
      case 'sendEmail':
        const { status, code } = await sendMail({ request: job.data });
        console.log('status: ', status, 'code: ', code);
        break;

      default:
        console.log(`Error: JobName ${job.name} no parametrizado`);
        break;
    }
  },
  {
    connection: {
      port: parseInt(process.env.dbRedisPort, 10) || 6379, // Redis port
      host: process.env.dbRedisHost || 'localhost', // Redis host
      password: process.env.dbRedisPassword || '',
      db: 2, // Defaults to 0
    },
  },
);

export const getGeneralQueue = () => {
  return generalQueue;
};

export const getGeneralWorker = () => {
  return generalWorker;
};
