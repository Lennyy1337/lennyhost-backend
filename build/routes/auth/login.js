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
exports.loginRoute = void 0;
const fastify_1 = require("../../init/fastify");
const jwt_1 = require("../../init/jwt");
const prisma_1 = require("../../init/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
function loginRoute() {
    return __awaiter(this, void 0, void 0, function* () {
        fastify_1.fastify.post('/auth/login', function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!request.body) {
                    reply.code(400).send({ success: false, message: "This route requires a JSON body" });
                    return;
                }
                const { email, password } = request.body;
                if (!email || !password) {
                    reply.code(400).send({ success: false, message: "One or more fields missing." });
                    return;
                }
                try {
                    const user = yield prisma_1.prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    });
                    if (!(yield bcrypt_1.default.compare(password, user.password))) {
                        reply.send({ success: false, message: "Invalid Password." });
                        return;
                    }
                    const jwtToken = yield jwt_1.jwt.signToken(user, "4d");
                    reply.send({ success: true, message: "Logged in!", data: jwtToken });
                }
                catch (e) {
                    reply.send({ success: false, message: "No user found with that email." });
                    return;
                }
            });
        });
    });
}
exports.loginRoute = loginRoute;
