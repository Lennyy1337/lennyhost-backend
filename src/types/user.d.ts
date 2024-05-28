type Action = 'user:registration' | 'user:login' | 'user:session';

interface CreateUser {
    username: string;
    email: string;
    password: string;
}

interface ConfirmCreateJwtUserSession {
    type: Action;
    data: {
        user: {
            id: string;
        };
        session: {
            id: string;
            secret: string;
        };
    };
}

export { CreateUser, ConfirmCreateJwtUserSession };
