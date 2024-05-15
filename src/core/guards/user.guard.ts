import { FastifyReply, FastifyRequest } from 'fastify';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { verifyJwtToken } from 'src/utils/jwt';

async function userGuard(
    request: FastifyRequest,
    reply: FastifyReply,
): Promise<void> {
    try {
        const { authorization } = request.headers;

        if (!authorization) {
        }

        // @ts-ignore
        const [scheme, token] = authorization.split(' ');

        if (scheme.toLowerCase() !== 'bearer' || !token) {
        }

        const data = await verifyJwtToken(token);

        if (!data) {
            reply.status(400);
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
        }

        if (error instanceof JsonWebTokenError) {
        }

        // throw error
    }
}

export default userGuard;
