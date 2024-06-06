import fastify from 'fastify';

const loggerConfig = {
    level: 'info',
    redact: ['headers.authorization'],
    serializers: {
        req(request: any) {
            return {
                method: request.method,
                url: request.url,
                hostname: request.hostname,
                remoteAddress: request.ip,
                remotePort: request.socket.remotePort,
            };
        },
    },
};

const app = fastify({ logger: loggerConfig });
const logger = app.log;

export { loggerConfig, logger };
