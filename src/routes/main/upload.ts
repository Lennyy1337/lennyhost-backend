import { Readable } from "stream";
import { fastify } from "../../init/fastify";
import FileManager from "../../init/file";
import { prisma } from "../../init/prisma";
import { jwt } from "../../init/jwt";

export async function uploadRoute() {
  fastify.post("/upload", async function (request, reply) {
    try {
      const data = await request.file();
      const file = data?.file;
      const allowedFileTypes = ["image/*", "video/*"];
      const { authorization } = request.headers;
      let allowed = false;

      if (!authorization) {
        return reply
          .code(403)
          .send({ success: false, message: "No authorization" });
      }

      if (!file) {
        return reply
          .code(400)
          .send({ success: false, message: "No file uploaded." });
      }

      for (const type of allowedFileTypes) {
        const regex = new RegExp("^" + type.replace("*", ".*") + "$");
        if (regex.test(data.mimetype)) {
          allowed = true;
          break;
        }
      }

      if (!allowed) {
        return reply
          .code(400)
          .send({ success: false, message: "File type is not allowed." });
      }

      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        return reply
          .code(401)
          .send({ success: false, message: "Invalid Authorization." });
      }

      const FileKey = await FileManager.uploadFile(
        file as Readable,
        data.filename
      );

      const upload = await prisma.upload.create({
        data: {
          mimetype: data.mimetype,
          fileKey: FileKey,
          fileName: data.filename,
          userId: user.id,
        },
      });

      return reply.send({ success: true, message: "Uploaded!", data: upload });
    } catch (e: any) {
      if (e.message.includes("is not allowed")) {
        return reply
          .code(400)
          .send({ success: false, message: "File type is not allowed." });
      }
      console.error("Error in upload:", e);
      return reply
        .code(500)
        .send({ success: false, message: "Internal Server Error." });
    }
  });
}
