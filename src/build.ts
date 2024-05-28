import Fastify, { FastifyInstance } from 'fastify';
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyMultipart from '@fastify/multipart';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';

import { loggerConfig } from './utils/logger';
import { randId } from './utils/randId';

// import { routes } from './api/routes';

const buildServer = () => {
    const app: FastifyInstance = Fastify({
        trustProxy: true,
        logger: loggerConfig,
        genReqId() {
            return randId('req', 16);
        },
    });

    // plugin section
    app.register(fastifyRateLimit, {
        max: 5,
        timeWindow: '1 second',
    });
    app.register(fastifyCors, {
        origin: '*', // for now set the wildcard
    });
    app.register(fastifyHelmet);
    app.register(fastifyMultipart, {
        // todo.
    });
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.setNotFoundHandler(function (request, reply) {
        return reply.code(404).send({
            error: {
                message: `Route of ${request.url} with method ${request.method} was not found`,
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
