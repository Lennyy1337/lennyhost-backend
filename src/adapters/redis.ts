import { Redis } from 'ioredis';
import { config } from 'dotenv';

import { logger } from 'src/utils';

config();

const redis = new Redis(process.env.REDIS_URL as string);

redis.on('connect', () => {
    logger.info('Connected to Redis');
});

redis.on('error', (error) => {
    logger.error(error);
});

export default redis;
