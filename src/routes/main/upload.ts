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

      if (!authorization) {
        reply.code(403).send({ success: false, message: "No authorization" });
        return;
      }
      if (!file) {
        reply.code(400).send({ success: false, message: "No file uploaded." });
        return;
      }

      let allowed = false;

      for (const type of allowedFileTypes) {
        const regex = new RegExp("^" + type.replace("*", ".*") + "$");
        if (regex.test(data.mimetype)) {
          allowed = true;
          break;
        }
      }

      if (!allowed) {
        throw new Error(`File type ${data.mimetype} is not allowed`);
      }

      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        reply.send({ success: false, message: "Invalid Authorization." });
        return;
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
          userId: user?.id as string,
        },
      });

      reply.send({ success: true, message: "Uploaded!", data: upload });
    } catch (e: any) {
      if (e.message.includes("is not allowed")) {
        reply
          .code(400)
          .send({ success: false, message: "File type is not allowed." });
        return;
      }
      reply
        .code(500)
        .send({ success: false, message: "Internal Server Error." });
      console.log("Error in upload;");
      console.log(e);
    }
  });
}
