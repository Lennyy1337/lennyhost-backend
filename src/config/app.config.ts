import { config } from 'dotenv';

config();

const APP_CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || '0.0.0.0',
};

export { APP_CONFIG };
