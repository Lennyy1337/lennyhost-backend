import { fastify } from "../../../../init/fastify";
import { jwt } from "../../../../init/jwt";
import fs from "fs";
import ShortUniqueId from "short-unique-id";

const uuid = new ShortUniqueId({ length: 4 });
function generateSxcu(jwt: string, domain: string): string {
  const sxcuTemplate = `{
      "Version": "16.0.1",
      "Name": "Lenny.host (${domain})",
      "DestinationType": "ImageUploader",
      "RequestMethod": "POST",
      "RequestURL": "${domain}/upload",
      "Headers": {
        "authorization": "${jwt}"
      },
      "Body": "MultipartFormData",
      "FileFormName": "file",
      "URL": "${domain}/uploads/{json:data.fileKey}"
    }`;

  return sxcuTemplate;
}

export async function getSxcuRoute() {
  fastify.post("/sharex/getsxcu", async function (request, reply) {
    try {
      if (!request.body) {
        reply
          .code(400)
          .send({ success: false, message: "This route requires a JSON body" });
        return;
      }
      const { authorization } = request.headers;
      const { domain } = request.body as any;
      if (!authorization) {
        reply.code(403).send({ success: false, message: "No authorization" });
        return;
      }

      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        reply.send({ success: false, message: "Invalid authorization" });
      }

      const newToken = await jwt.signToken(user!, "600d");

      const sxcu = generateSxcu(newToken, domain as string);
      const filename = `${domain}.${uuid.randomUUID()}.sxcu`;
      const path = `uploads/${filename}`;
      const file = await fs.promises.writeFile(path, sxcu);

      reply.send({
        success: true,
        message: "Success",
        data: `/uploads/${filename}`,
      });
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
      console.log("Error in sharexsxcu;");
      console.log(e);
    }
  });
}
