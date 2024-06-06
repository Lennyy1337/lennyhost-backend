import { APP_CONSTANTS } from '@/config/app.config';
import buildServer from '@/build';

import db from '@/adapters/db';

const server = buildServer();

const start = (port: number, host: string): void => {
    try {
        server.log.info(
            `Server is starting in ${APP_CONSTANTS.ENVIRONMENT} mode`
        );

        db.$connect()
            .then(() => server.log.info('Database client connected'))
            .catch((error: any) => {
                server.log.error('Failed to connect to database', error);
                process.exit(1);
            });

        server
            .listen({ port, host })
            .then(() => server.log.info('Server is ready to serve requests'));
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

const shutdown = async () => {
    server.log.info('Starting graceful shutdown');

    server.log.info('Disconnecting from database');
    await db.$disconnect();

    server.log.info('Shutting server down');
    await server.close();

    server.log.info('Server is shut down');
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default start;
