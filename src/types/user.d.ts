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

export interface UpdatedUserRepository extends CreateUserRepository {}
