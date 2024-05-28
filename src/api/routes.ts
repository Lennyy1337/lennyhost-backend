import { FastifyInstance } from 'fastify';

const routes = (router: FastifyInstance) => {
    router.get('/healthcheck', (_, reply) => {
        reply.status(200).send('Ok!');
    });
};

export { routes };
