import SharedServiceBase from '@/shared/shared-service';
import { userRepository } from '@/repository';
import { hash, verify } from '@/utils/argon2';

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

    public async signInUser(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        if (!(await verify(user.password, password))) {
            throw new this.httpException(
                403,
                `Invalid credentials provided`,
                'invalid_request_error'
            );
        }

        const accessTokenId = this.id.generateCUID('at', 32);
        const refreshTokenId = this.id.generateCUID('rt', 32);

        const tokens = {
            accessToken: await this.jwt.generateJwtToken(
                {
                    object: {
                        type: 'user:accessToken',
                        id: accessTokenId,
                        refreshToken: {
                            id: refreshTokenId,
                        },
                        user: {
                            id: user.id,
                        },
                    },
                },
                '3d'
            ),
            refreshToken: await this.jwt.generateJwtToken(
                {
                    object: {
                        type: 'user:refreshToken',
                        id: refreshTokenId,
                        user: {
                            id: user.id,
                        },
                    },
                },
                '365d'
            ),
        };

        if (!user.two_fa) {
            return {
                '2fa': false,
                tokens,
            };
        }

        // TODO: Implement 2FA Turnkey system
        return {
            '2fa': true,
            tokens: {},
        };
    }

    public async findUserById(id: string) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new this.httpException(
                404,
                `Resource user with ID ("${id}") does not exist.`,
                'invalid_request_error'
            );
        }

        return user;
    }

    public async findUserByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new this.httpException(
                404,
                `Resource user with Email ("${email}") does not exist.`,
                'invalid_request_error'
            );
        }

        return user;
    }
}

export default UserService;
