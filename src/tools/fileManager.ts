import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { prisma } from "../init/prisma";
import { jwt } from "../init/jwt";

interface file {
    id: string;
    mimetype: string;
    fileKey: string;
    fileName: string;
    userId: string;
}
export default class fileManager {
    declare filepath: string;

    constructor(filepath: string){
        this.filepath = filepath;
    }

    async getFile(fileKey: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.filepath, fileKey);
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    if (err.code === "ENOENT") {
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(data);
                }
            });
        });
    }

    async uploadFile(fileStream: Readable, originalFileName: string): Promise<string> {
        const fileExtension = path.extname(originalFileName);
        const fileKey = uuidv4() + fileExtension;
        const filePath = path.join(this.filepath, fileKey);
        
        return new Promise<string>((resolve, reject) => {
            const chunks: any[] = [];
            fileStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            fileStream.on('end', () => {
                const fileData = Buffer.concat(chunks);
                fs.writeFile(filePath, fileData, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(fileKey);
                    }
                });
            });
            fileStream.on('error', (err) => {
                reject(err);
            });
        });
    }

    async getUserFiles(jwtToken: string): Promise<file[] | null>{
        const user = await jwt.getUserFromJWT(jwtToken)

        if(!user){
            return null
        }

        const files = await prisma.upload.findMany({
            where: {
                userId: user.id
            }
        })

        return files

    }
    

}
