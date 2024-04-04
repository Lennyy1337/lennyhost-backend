import { fastify } from "../../../init/fastify";
import { prisma } from "../../../init/prisma";
import { jwt } from "../../../init/jwt";
import { v4 } from "uuid";

export async function generateKey() {
  fastify.post("/key/generate", async function (request, reply) {
    try {
      if (!request.body) {
        reply
          .code(400)
          .send({ success: false, message: "This route requires a JSON body" });
        return;
      }

      const { authorization } = request.headers;
      const { type } = request.body as any;

      if (!authorization) {
        reply.code(403).send({ success: false, message: "No authorization" });
        return;
      }

      if (!type) {
        reply
          .code(403)
          .send({
            success: false,
            message: "Please set the desired whitelist type of the key.",
          });
        return;
      }

      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        reply.send({ success: false, message: "Invalid Authorization." });
        return;
      }

      // why did i do this
      let allowed: boolean = false;

      if (user.role == ("OWNER" as any)) {
        allowed = true;
      }

      if (user.role == ("STAFF" as any)) {
        allowed = true;
      }

      if (!allowed) {
        reply
          .code(403)
          .send({
            success: false,
            message: "You are not authorized to perform this action.",
          });
        return;
      }

      const key = await prisma.key.create({
        data: {
          key: v4(),
          type: type,
        },
      });

      reply.send({ success: true, message: "Key created!", data: key });
    } catch (e: any) {
      if (e.message.includes("Expected KeyRoles")) {
        reply.code(400).send({ success: false, message: "Invalid key type." });
        return;
      }
      reply
        .code(500)
        .send({ success: false, message: "Internal Server Error." });
      console.log("Error in generate Key;");
      console.log(e);
    }
  });
}
