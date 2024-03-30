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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadedFilesRoute = void 0;
const fastify_1 = require("../../init/fastify");
const prisma_1 = require("../../init/prisma");
const jwt_1 = require("../../init/jwt");
function getUploadedFilesRoute() {
    return __awaiter(this, void 0, void 0, function* () {
        fastify_1.fastify.get('/user/files', function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { authorization } = request.headers;
                    if (!authorization) {
                        reply.code(403).send({ success: false, message: "No authorization" });
                        return;
                    }
                    const user = yield jwt_1.jwt.getUserFromJWT(authorization);
                    if (!user) {
                        reply.send({ success: false, message: "Invalid Authorization." });
                    }
                    const files = yield prisma_1.prisma.upload.findMany({
                        where: {
                            userId: user === null || user === void 0 ? void 0 : user.id
                        }
                    });
                    reply.send({ success: true, message: "Success!", data: files });
                }
                catch (e) {
                    reply.code(500).send({ success: false, message: "Internal Server Error." });
                    console.log("Error in getUploadedFiles;");
                    console.log(e);
                }
            });
        });
    });
}
exports.getUploadedFilesRoute = getUploadedFilesRoute;
