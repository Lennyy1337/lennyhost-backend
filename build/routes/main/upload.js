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
exports.uploadRoute = void 0;
const fastify_1 = require("../../init/fastify");
const file_1 = __importDefault(require("../../init/file"));
const prisma_1 = require("../../init/prisma");
const jwt_1 = require("../../init/jwt");
function uploadRoute() {
    return __awaiter(this, void 0, void 0, function* () {
        fastify_1.fastify.post('/upload', function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield request.file();
                    const file = data === null || data === void 0 ? void 0 : data.file;
                    const allowedFileTypes = ['image/*', 'video/*'];
                    const { authorization } = request.headers;
                    if (!authorization) {
                        reply.code(403).send({ success: false, message: "No authorization" });
                        return;
                    }
                    if (!file) {
                        reply.code(400).send({ success: false, message: "No file uploaded." });
                        return;
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
                    const user = yield jwt_1.jwt.getUserFromJWT(authorization);
                    if (!user) {
                        reply.send({ success: false, message: "Invalid Authorization." });
                    }
                    const FileKey = yield file_1.default.uploadFile(file, data.filename);
                    const upload = yield prisma_1.prisma.upload.create({
                        data: {
                            mimetype: data.mimetype,
                            fileKey: FileKey,
                            fileName: data.filename,
                            userId: user === null || user === void 0 ? void 0 : user.id,
                        }
                    });
                    reply.send({ success: true, message: "Uploaded!", data: upload });
                }
                catch (e) {
                    if (e.message.includes('is not allowed')) {
                        reply.code(400).send({ success: false, message: "File type is not allowed." });
                        return;
                    }
                    reply.code(500).send({ success: false, message: "Internal Server Error." });
                    console.log("Error in upload;");
                    console.log(e);
                }
            });
        });
    });
}
exports.uploadRoute = uploadRoute;
