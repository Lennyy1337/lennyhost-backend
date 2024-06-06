import { Redis } from 'ioredis';
import { logger } from '@/utils/logger';
import { APP_CONSTANTS } from '@/config/app.config';

const redisInstance = new Redis(APP_CONSTANTS.REDIS_URL as string);

redisInstance.on('connect', () => {
    logger.info('Connected to Redis instance');
});

redisInstance.on('error', (error) => {
    logger.error(error);
    process.exit(1);
});

export default redisInstance;
