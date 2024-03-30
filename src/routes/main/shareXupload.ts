import { Readable } from "stream";
import { fastify } from "../../init/fastify";
import FileManager from "../../init/file";
import { prisma } from "../../init/prisma";
import {jwt} from "../../init/jwt";
import bcrypt from 'bcrypt'

function extract(authHeader: string): string[] | null {
    const creds = authHeader.split(':');

    if (!authHeader) {
        return null;
    }


    return creds
}

// Modified for shareX compatiblity
// Expected authorization: email:password

export async function uploadShareXRoute(){
    fastify.post('/upload/sharex', async function(request, reply){
        try{
            const data = await request.file()
            const file = data?.file

            const allowedFileTypes = ['image/*', 'video/*'];

            const { authorization } = request.headers

            if(!authorization){
                reply.code(403).send({success: false, message: "No authorization"})
                return
            }
            if(!file){
                reply.code(400).send({success: false, message: "No file uploaded."})
                return
            }
            
            const creds = extract(authorization)
            const email = creds![0]
            const password = creds![1]

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if(!user){
                reply.code(403).send({success: false, message: "Invalid Email."})
                return
            }
            if(!(await bcrypt.compare(password as string, user!.password))){
                reply.code(403).send({success: false, message: "Invalid Password."})
                return
            }

            let allowed = false;

            for (const type of allowedFileTypes) {
                const regex = new RegExp('^' + type.replace('*', '.*') + '$');
                if (regex.test(data.mimetype)) {
                    allowed = true;
                    break;
                }
            }

            if (!allowed) {
                throw new Error(`File type ${data.mimetype} is not allowed`);
            }
            
            const FileKey = await FileManager.uploadFile(file as Readable, data.filename)
    
            const upload = await prisma.upload.create({
                data: {
                    mimetype: data.mimetype,
                    fileKey: FileKey,
                    fileName: data.filename,
                    userId: user?.id as string,
                }
            })

            reply.send({success: true, message: "Uploaded!", data: upload})
            
        }catch(e: any){
            if (e.message.includes('is not allowed')) {
                reply.code(400).send({success: false, message: "File type is not allowed."});
                return
            }
            reply.code(500).send({success: false, message: "Internal Server Error."})
            console.log("Error in upload;")
            console.log(e)
        }
    })
}