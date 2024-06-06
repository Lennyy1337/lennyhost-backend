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
                data: {
                    id: user.id,
                },
            });
        } catch (error) {
            return handleHttpExceptionError(error, reply);
        }
    }
}

export default UserHandler;
