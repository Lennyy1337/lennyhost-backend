export interface CreateUserRepository {
    username: string,
    email: string,
    password: string,
    avatar: string,  
}

export interface CreatedUserRepository extends CreateUserRepository {}

export interface UpdatedUserRepository extends CreateUserRepository {}