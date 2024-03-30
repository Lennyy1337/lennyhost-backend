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
exports.registerRoute = void 0;
const fastify_1 = require("../../init/fastify");
const prisma_1 = require("../../init/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
function registerRoute() {
    return __awaiter(this, void 0, void 0, function* () {
        fastify_1.fastify.post('/auth/register', function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!request.body) {
                        reply.code(400).send({ success: false, message: "This route requires a JSON body" });
                        return;
                    }
                    const { username, email, password } = request.body;
                    if (!username || !email || !password) {
                        reply.code(400).send({ success: false, message: "One or more fields missing." });
                        return;
                    }
                    const verifyEmail = RegExp("^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$").test(email);
                    if (!verifyEmail) {
                        reply.send({ success: false, message: "Email is not a valid Email" });
                        return;
                    }
                    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                    try {
                        yield prisma_1.prisma.user.create({
                            data: {
                                username: username,
                                email: email,
                                password: hashedPassword
                            }
                        });
                    }
                    catch (e) {
                        reply.send({ success: false, message: "Account Already exists!" });
                        return;
                    }
                    reply.send({ success: true, message: "Account Created!" });
                }
                catch (e) {
                    reply.code(500).send({ success: false, message: "Internal Server Error." });
                    console.log("Error in user registration;");
                    console.log(e);
                }
            });
        });
    });
}
exports.registerRoute = registerRoute;
