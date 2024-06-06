import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '@/services';
import { handleHttpExceptionError } from '@/utils/http';

class UserHandler {
    public async createUser(
        request: FastifyRequest<{
            Body: { username: string; email: string; password: string };
        }>,
        reply: FastifyReply
    ) {
        try {
            const user = await userService.create(request.body);

            return reply.status(201).send({
                user: {
                    id: user.id,
                },
            });
        } catch (error) {
            return handleHttpExceptionError(error, reply);
        }
    }

    public async signInUser(
        request: FastifyRequest<{
            Body: { email: string; password: string };
        }>,
        reply: FastifyReply
    ) {
        try {
            const user = await userService.signInUser(
                request.body.email,
                request.body.password
            );

            return reply.status(200).send({
                user,
            });
        } catch (error) {
            return handleHttpExceptionError(error, reply);
        }
    }
}

export default UserHandler;
