import { FastifyInstance } from 'fastify';

import { userRoute } from './user.route';

export default async function routes(router: FastifyInstance) {
    router.register(userRoute, {
        prefix: '/users',
    });
}
