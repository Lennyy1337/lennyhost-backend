import { config } from 'dotenv';

config();

const APP_CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || '0.0.0.0',
    AES_SECRET: process.env.AES_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ISSUER: 'Lenny.Host',
};

export { APP_CONFIG };
