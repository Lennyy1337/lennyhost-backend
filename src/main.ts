import { APP_CONSTANTS } from '@/config/app.config';
import start from '@/server';

start(Number(APP_CONSTANTS.PORT), APP_CONSTANTS.HOST);
