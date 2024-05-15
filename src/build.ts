import Fastify, { FastifyInstance } from 'fastify';
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';

import { loggerConfig } from './utils/logger';
import { randId } from './utils/randId';

const buildServer = () => {
    const app: FastifyInstance = Fastify({
        trustProxy: true,
        logger: loggerConfig,
        genReqId() {
            return randId('req', 16);
        },
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
