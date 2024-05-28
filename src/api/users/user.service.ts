import db from '@/adapters/db';
import { generateJwtToken, verifyJwtToken } from '@/utils/jwt';
import { randId } from '@/utils/randId';
import { createHash } from 'crypto';

import { ConfirmCreateJwtUserSession, CreateUser } from 'src/types/user';

import { hash } from '@/utils/argon2';

class UserService {
    private readonly db: typeof db;

    constructor() {
        this.db = db;
    }

    public async createUser(params: CreateUser) {
        const user = await this.db.user.create({
            data: {
                id: randId('usr', 32),
                secret: randId('sk', 128),
                password: (await hash(params.password)) as string,
                email: params.email,
                username: params.username,
            },
        });

        const sessionId = randId('sns', 16);
        const hashedSecret = createHash(
            JSON.stringify({ sessionId, secret: user.secret }),
        ).digest('hex');

        const token: string = await generateJwtToken(
            {
                type: 'user:registration',
                data: {
                    user: {
                        id: user.id,
                    },
                    session: {
                        id: sessionId,
                        secret: hashedSecret,
                    },
                },
            },
            '10m',
        );

        // todo: send an email (for @lenny)

        return token;
    }

    public async verifyCreateUser(token: string) {
        const data = (await verifyJwtToken(
            token,
        )) as ConfirmCreateJwtUserSession;

        if (!data) {
            throw new Error('token does not seem to exist');
        }

        const user = await this.getUser({ id: data.data.user.id });

        if (!user) {
            throw new Error('user does not exist');
        }

        await this.db.user.update({
            where: {
                id: user.id,
            },
            data: {
                verified: true,
            },
        });

        return { verified: true };
    }

    private async getUser(params: {
        id?: string;
        username?: string;
        email?: string;
    }) {
        const where: { id?: string; username?: string; email?: string } = {};

        if (params.id) {
            where.id = params.id;
        }

        if (params.username) {
            where.username = params.username;
        }

        if (params.email) {
            where.email = params.email;
        }

        if (!params.id && !params.username && !params.email) return null;

        return await this.db.user.findUnique({
            // @ts-ignore
            where,
        });
    }

    // TODO:
    public async updateUser() {}
}

const userService = new UserService();

export default userService;
