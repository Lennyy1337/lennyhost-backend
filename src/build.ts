import Fastify, { FastifyInstance } from 'fastify';
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyEtag from '@fastify/etag';

import redisInstance from '@/adapters/redis';

import { loggerConfig } from '@/utils/logger';
import { id } from '@/utils/id';
import { APP_CONSTANTS } from './config/app.config';

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

    app.register(rateLimit, {
        global: true,
        max: 4,
        ban: 5,
        timeWindow: '10 second',
        redis: redisInstance,
        nameSpace: 'rate-limit',
    });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

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
                type: error.type || 'api',
            },
        });
    });

    app.addHook('onSend', async (request: any, reply, payload) => {
        reply.header('X-Request-ID', request.id);

        return payload;
    });

    return app;
};

export default buildServer;
