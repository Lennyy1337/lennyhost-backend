import { fastify } from "./init/fastify";
import { loginRoute } from "./routes/auth/login";
import { registerRoute } from "./routes/auth/register";
import { getUploadedFilesRoute } from "./routes/main/getuploadedfiles";
import { uploadRoute } from "./routes/main/upload";

export function router(){
    fastify.register(registerRoute)
    fastify.register(loginRoute)
    fastify.register(uploadRoute)
    fastify.register(getUploadedFilesRoute)
}