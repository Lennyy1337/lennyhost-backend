import jwt, { SignOptions } from 'jsonwebtoken'
import { prisma } from '../init/prisma';

enum role {
    "OWNER",
    "PREMIUM",
    "REGULAR"
}

interface upload {
    id       : string
    mimetype : string
    fileKey  : string 
    fileName : string
    user     : user  
    userId   : string
}
interface user {
    id       : string,  
    password : string
    username : string
    email    : string   
    role     : role    
    uploads  : upload[]
}
export class jwtToken{
    private secret: string

    constructor(secret: string){
        this.secret = secret
    }

    async signToken(payload: object, expiresIn: string): Promise<string>{
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn: expiresIn,
                    issuer: process.env.JWT_ISSUER,
                },
                (error, token: any) => {
                    if (error) {
                        reject(new Error('Error generating JWT token'));
                    } else {
                        resolve(token);
                    }
                },
            );
        });
    };
    

    async verifyJwtToken(token: string): Promise<any>{
        return jwt.verify(token, process.env.JWT_SECRET_KEY as string, {
            issuer: process.env.JWT_ISSUER,
        });
    };

    async getUserFromJWT(token: string): Promise<user | null>{
        try{
            const data = await this.verifyJwtToken(token)
            const user = await prisma.user.findUnique({
                where: {
                    email: data.email
                },
                select: {
                    username: true,
                    id: true,
                    email: true,
                    role: true
                }
            
            })
            return user as any
        }catch(e){
            return null
        }
    }

}