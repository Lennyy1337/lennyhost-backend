import SharedServiceBase from '@/shared/shared-service';
import { userRepository } from '@/repository';
import { hash, verify } from '@/utils/argon2';

import {
    RedisUserRefreshToken,
    RedisUserAccessToken,
    RedisMFAToken,
    MfaJwtToken,
} from '@/types/user';
import { createHash } from 'crypto';

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

        if (!user.two_fa) {
            return {
                '2fa': false,
                tokens: await this.generateTokens(user),
            };
        }

        const mfaSecret: string = this.id.generateCUID('sk', 32);
        const mfaTokenRedis: RedisMFAToken = {
            type: 'mfaToken',
            object: {
                user: {
                    id: user.id,
                },
                metadata: {
                    id: this.id.generateGUID(),
                    secret: mfaSecret,
                },
            },
        };

        await this.redis.set(
            `user:${user.id}:mfa-tokens`,
            JSON.stringify(mfaTokenRedis),
            'EX',
            3600 / 4
        );

        return {
            '2fa': true,
            tokens: {
                mfaToken: await this.jwt.generateJwtToken(
                    {
                        type: 'user:mfaToken',
                        object: {
                            id: mfaTokenRedis.object.metadata.id,
                            user: {
                                id: user.id,
                            },
                            metadata: {
                                hash: createHash('sha256')
                                    .update(
                                        mfaTokenRedis.object.metadata.secret
                                    )
                                    .digest('hex'),
                            },
                        },
                    },
                    '15m'
                ),
            },
        };
    }

    public async confirmMFA(code: string, mfaToken: string) {
        const decodedToken = (await this.jwt.verifyJwtToken(
            mfaToken
        )) as MfaJwtToken;

        if (!decodedToken) {
            throw new this.httpException(
                400,
                'Invalid jwt token provided',
                'invalid_request_error'
            );
        }

        const redisMfaSession = await this.redis.get(
            `user:${decodedToken.object.user.id}:mfa-tokens`
        );

        if (!redisMfaSession) {
            throw new this.httpException(
                404,
                'Invalid session token provided',
                'invalid_request_error'
            );
        }

        const parsedMfaSession = JSON.parse(redisMfaSession) as RedisMFAToken;

        return {
            tokens: await this.generateTokens(parsedMfaSession.object.user),
        };
    }

    private async generateTokens(user: { id: string }) {
        const accessTokenId = this.id.generateCUID('at', 32);
        const refreshTokenId = this.id.generateCUID('rt', 32);

        // TODO: use IPHASH in `allowFrom`
        const redisRefreshToken: RedisUserRefreshToken = {
            type: 'refreshToken',
            object: {
                user: {
                    id: user.id,
                    allowFrom: '0.0.0.0',
                },
                metadata: {
                    id: refreshTokenId,
                    secret: this.id.generateCUID('sk', 64),
                },
            },
        };

        const redisAccessToken: RedisUserAccessToken = {
            type: 'accessToken',
            object: {
                id: accessTokenId,
                refreshTokenId: refreshTokenId,
                hash: createHash('sha256')
                    .update(redisRefreshToken.object.metadata.secret)
                    .digest('hex'),
            },
        };

        await this.redis.set(
            `user:${user.id}:refresh-tokens`,
            JSON.stringify(redisRefreshToken),
            'EX',
            3600 * 24 * 365
        );

        await this.redis.set(
            `user:${user.id}:access-tokens`,
            JSON.stringify(redisAccessToken),
            'EX',
            3600 * 24 * 3
        );

        return {
            accessToken: await this.jwt.generateJwtToken(
                {
                    type: 'user:accessToken',
                    object: {
                        id: accessTokenId,
                        user: {
                            id: user.id,
                        },
                        metadata: {
                            refreshTokenId: refreshTokenId,
                            hash: redisAccessToken.object.hash,
                        },
                    },
                },
                '3d'
            ),
            refreshToken: await this.jwt.generateJwtToken(
                {
                    type: 'user:refreshToken',
                    object: {
                        id: refreshTokenId,
                        user: {
                            id: user.id,
                        },
                    },
                },
                '365d'
            ),
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
