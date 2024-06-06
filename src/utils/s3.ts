import { Storage } from '@veltahq/storage';
import { config } from 'dotenv';

config();

const s3 = new Storage({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_ACCESS_SECRET_KEY as string,
    },
    region: process.env.S3_REGION as string,
    bucket: process.env.S3_BUCKET as string,
});

export { s3 };
