"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const prisma_1 = require("../init/prisma");
const jwt_1 = require("../init/jwt");
class fileManager {
    constructor(filepath) {
        this.filepath = filepath;
    }
    getFile(fileKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const filePath = path_1.default.join(this.filepath, fileKey);
                fs_1.default.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        if (err.code === "ENOENT") {
                            resolve(null);
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    uploadFile(fileStream, originalFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileExtension = path_1.default.extname(originalFileName);
            const fileKey = (0, uuid_1.v4)() + fileExtension;
            const filePath = path_1.default.join(this.filepath, fileKey);
            return new Promise((resolve, reject) => {
                const chunks = [];
                fileStream.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                fileStream.on('end', () => {
                    const fileData = Buffer.concat(chunks);
                    fs_1.default.writeFile(filePath, fileData, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(fileKey);
                        }
                    });
                });
                fileStream.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
    getUserFiles(jwtToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield jwt_1.jwt.getUserFromJWT(jwtToken);
            if (!user) {
                return null;
            }
            const files = yield prisma_1.prisma.upload.findMany({
                where: {
                    userId: user.id
                }
            });
            return files;
        });
    }
}
exports.default = fileManager;
