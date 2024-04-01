import { fastify } from "./init/fastify";
import { loginRoute } from "./routes/auth/login";
import { registerRoute } from "./routes/auth/register";
import { generateKey } from "./routes/main/key/generateKey";
import { getUploadedFilesRoute } from "./routes/main/getuploadedfiles";
import { getSxcuRoute } from "./routes/main/sharex/getsxcu/getSxcu";
import { uploadShareXRoute } from "./routes/main/sharex/shareXupload";
import { uploadRoute } from "./routes/main/upload";

export function router(){
    fastify.register(registerRoute)
    fastify.register(loginRoute)
    fastify.register(uploadRoute)
    fastify.register(getUploadedFilesRoute)
    //fastify.register(uploadShareXRoute)
    fastify.register(getSxcuRoute)
    fastify.register(generateKey)
}