import SharedServiceBase from "@/shared/shared-service";
import { CreateUserRepository, CreatedUserRepository, UpdatedUserRepository } from "@/types/user";

class UserRepository extends SharedServiceBase {
    public async create(user: CreateUserRepository): Promise<CreatedUserRepository> {
        return await this.db.user.create({
            data:{
                id: this.id.generateSnowflake(),
                ...user,
            }
        })
    }

    public async findByEmail(email: string) {
        return await this.db.user.findUnique({
            where: {
                email,
            }
        })
    }

    public async findById(id: string) {
        return await this.db.user.findUnique({
            where: {
                id,
            }
        })
    }

    public async findByUsername(username: string) {
        return await this.db.user.findUnique({
            where: {
                username,
            }
        })
    }

    public async update(id: string, user: UpdatedUserRepository): Promise<UpdatedUserRepository> {
        return await this.db.user.update({
            where: {
                id,
            },
            data:{
                id: this.id.generateSnowflake(),
                ...user,
            }
        })
    }

    public async delete(id: string) {
        return await this.db.user.delete({
            where: {
                id,
            }
        })
    }
}

export default UserRepository 