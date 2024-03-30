"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const fastify_1 = require("./init/fastify");
const login_1 = require("./routes/auth/login");
const register_1 = require("./routes/auth/register");
const getuploadedfiles_1 = require("./routes/main/getuploadedfiles");
const upload_1 = require("./routes/main/upload");
function router() {
    fastify_1.fastify.register(register_1.registerRoute);
    fastify_1.fastify.register(login_1.loginRoute);
    fastify_1.fastify.register(upload_1.uploadRoute);
    fastify_1.fastify.register(getuploadedfiles_1.getUploadedFilesRoute);
}
exports.router = router;
