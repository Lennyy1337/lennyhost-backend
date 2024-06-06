import SharedServiceBase from '@/shared/shared-service';
import { userRepository } from '@/repository';
import { hash } from '@/utils/argon2';

class UserService extends SharedServiceBase {
    public readonly userRepository: typeof userRepository;

    constructor() {
        super();
        this.userRepository = userRepository;
    }

    public async create(user: {
        avatar?: {};
        username: string;
        email: string;
        password: string;
    }) {
        const path = `/users/:id/avatars/${this.id.generateCUID('ava', 64)}`;
        const usernameExists = await this.userRepository.findByUsername(
            user.username
        );

        if (usernameExists) {
            throw new this.httpException(
                409,
                `Conflict username ${user.username} has already been used.`,
                'invalid_request_error'
            );
        }

        const emailExists = await this.userRepository.findByEmail(user.email);

        if (emailExists) {
            throw new this.httpException(
                409,
                `Conflict email ${user.email} has already been used.`,
                'invalid_request_error'
            );
        }

        return await this.userRepository.create({
            avatar: path,
            username: user.username,
            password: (await hash(user.password)) as string,
            email: user.email,
        });
    }
}

export default UserService;
