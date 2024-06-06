import { config } from 'dotenv';
import crypto from 'crypto';
import os from 'os';

config();

const APP_CONSTANTS = {
    ENVIRONMENT: process.env.NODE_ENV,
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || '0.0.0.0',
    ORIGIN: process.env.ORIGIN || '*',
    EPOCH: 1706677310,
    MACHINE_ID:
        BigInt(
            `0x${crypto.createHash('sha256').update(os.hostname()).digest('hex')}`
        ) & 0xfffn,
    SEQUENCE_MASK: 0xfffn,
    JWT_ISSUER: 'kepler',
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
};

export { APP_CONSTANTS };
