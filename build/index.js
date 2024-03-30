"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = require("./init/fastify");
const router_1 = require("./router");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
if (!fs_1.default.existsSync("uploads")) {
    fs_1.default.mkdirSync("uploads");
}
(0, router_1.router)();
fastify_1.fastify.register(static_1.default, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads',
});
fastify_1.fastify.get('/uploads/:filekey', function (req, reply) {
    const { filekey } = req.params;
    reply.sendFile(filekey);
});
fastify_1.fastify.register(multipart_1.default, {
    limits: {
        fileSize: 524288000
    }
});
fastify_1.fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
    console.log(`LennyHost Listening on ${address}`);
    if (err) {
        fastify_1.fastify.log.error(err);
        process.exit(1);
    }
});
