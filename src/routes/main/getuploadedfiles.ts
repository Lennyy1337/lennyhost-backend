import { fastify } from "../../init/fastify";
import { prisma } from "../../init/prisma";
import { jwt } from "../../init/jwt";

export async function getUploadedFilesRoute() {
  fastify.get("/user/files", async function (request, reply) {
    try {
      const { authorization } = request.headers;

      if (!authorization) {
        reply.code(403).send({ success: false, message: "No authorization" });
        return;
      }
      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        reply.send({ success: false, message: "Invalid Authorization." });
      }

      const files = await prisma.upload.findMany({
        where: {
          userId: user?.id,
        },
      });

      reply.send({ success: true, message: "Success!", data: files });
    } catch (e) {
      reply
        .code(500)
        .send({ success: false, message: "Internal Server Error." });
      console.log("Error in getUploadedFiles;");
      console.log(e);
    }
  });
}
