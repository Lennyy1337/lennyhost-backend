type Token = 'accessToken' | 'refreshToken' | 'mfaToken';

export interface CreateUserRepository {
    avatar?: string;
    avatar_hash?: string;
    username: string;
    email: string;
    password: string;
}

export interface CreatedUserRepository {
    id: string;
}

export type RedisUserAccessToken = {
    type: Token;
    object: {
        id: string;
        refreshTokenId: string;
        hash: string;
    };
};

export type RedisUserRefreshToken = {
    type: Token;
    object: {
        user: {
            id: string;
            allowFrom: string;
        };
        metadata: {
            id: string;
            secret: string;
        };
    };
};

export type RedisMFAToken = {
    type: Token;
    object: {
        user: {
            id: string;
        };
        metadata: {
            id: string;
            secret: string;
        };
    };
};

export type MfaJwtToken = {
    type: string;
    object: {
        id: string;
        user: {
            id: string;
        };
        metadata: {
            hash: string;
        };
    };
};

export interface UpdatedUserRepository extends CreateUserRepository {}
