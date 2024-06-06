import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyEtag from '@fastify/etag';
import { fastifyYupSchema } from 'fastify-yup-schema';

import redisInstance from '@/adapters/redis';

import { loggerConfig } from '@/utils/logger';
import { id } from '@/utils/id';
import { APP_CONSTANTS } from '@/config/app.config';

import routes from '@/routes/routes';

const buildServer = () => {
    const app: FastifyInstance = Fastify({
        trustProxy: true,
        logger: loggerConfig,
        genReqId() {
            return id.generateCUID('req', 16);
        },
    });

    app.register(helmet);
    app.register(cors, {
        origin: APP_CONSTANTS.ORIGIN,
    });
    app.register(fastifyEtag);
    app.register(fastifyYupSchema);

    app.register(rateLimit, {
        global: true,
        max: 4,
        ban: 5,
        timeWindow: '10 second',
        redis: redisInstance,
        nameSpace: 'rate-limit',
    });

    app.setNotFoundHandler(function (request, reply) {
        return reply.code(404).send({
            error: {
                message: `Unrecognized request URL (${request.method}: ${request.url}).`,
                type: 'invalid_request',
            },
        });
    });

    app.setErrorHandler(function (error: any, _, reply) {
        if (error.statusCode === 400) {
            error.type = 'invalid_request';
        }

        return reply.status(error.statusCode as number).send({
            error: {
                message: error.message,
                type: error.type || 'api_error',
            },
        });
    });

    app.addHook('onSend', async (request: any, reply, payload) => {
        reply.header('X-Request-ID', request.id);

        return payload;
    });

    app.register(routes, { prefix: '/v1' });

    return app;
};

export default buildServer;
