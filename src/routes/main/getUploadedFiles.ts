import { fastify } from "../../init/fastify";
import { prisma } from "../../init/prisma";
import { jwt } from "../../init/jwt";

export async function getUploadedFilesRoute() {
  fastify.get("/user/files", async function (request, reply) {
    try {
      const { authorization } = request.headers;

      if (!authorization) {
        return reply
          .code(403)
          .send({ success: false, message: "No authorization" });
      }

      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        return reply
          .code(401)
          .send({ success: false, message: "Invalid Authorization." });
      }

      const files = await prisma.upload.findMany({
        where: {
          userId: user.id,
        },
      });

      return reply.send({ success: true, message: "Success!", data: files });
    } catch (e) {
      console.error("Error in getUploadedFiles:", e);
      return reply
        .code(500)
        .send({ success: false, message: "Internal Server Error." });
    }
  });
}
