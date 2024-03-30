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
exports.jwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../init/prisma");
var role;
(function (role) {
    role[role["OWNER"] = 0] = "OWNER";
    role[role["PREMIUM"] = 1] = "PREMIUM";
    role[role["REGULAR"] = 2] = "REGULAR";
})(role || (role = {}));
class jwtToken {
    constructor(secret) {
        this.secret = secret;
    }
    signToken(payload, expiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, {
                    expiresIn: expiresIn,
                    issuer: process.env.JWT_ISSUER,
                }, (error, token) => {
                    if (error) {
                        reject(new Error('Error generating JWT token'));
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    ;
    verifyJwtToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, {
                issuer: process.env.JWT_ISSUER,
            });
        });
    }
    ;
    getUserFromJWT(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.verifyJwtToken(token);
                const user = yield prisma_1.prisma.user.findUnique({
                    where: {
                        email: data.email
                    },
                    select: {
                        username: true,
                        id: true,
                        email: true,
                        role: true
                    }
                });
                return user;
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.jwtToken = jwtToken;
