import { FastifyInstance } from 'fastify';

import { userHandler } from '@/handlers';
import { createUserSchema } from '@/schemas/user.schema';

export async function userRoute(router: FastifyInstance) {
    router.route({
        method: 'POST',
        url: '/signup',
        schema: createUserSchema,
        handler: userHandler.createUser,
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute',
            },
        },
    });
}
