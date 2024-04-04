import { fastify } from "../../../init/fastify";
import { prisma } from "../../../init/prisma";
import { jwt } from "../../../init/jwt";

export async function redeemKey() {
  fastify.post("/key/redeem", async function (request, reply) {
    try {
      const { authorization } = request.headers;
      const { key } = request.body as any;

      if (!authorization) {
        reply.code(403).send({ success: false, message: "No authorization." });
        return;
      }

      if (!key) {
        reply.code(403).send({ success: false, message: "No key provided." });
        return;
      }

      const keyDB = await prisma.key.findUnique({
        where: {
          key: key,
        },
      });

      if (!keyDB) {
        reply.send({ success: false, message: "Invalid key provided." });
        return;
      }

      const user = await jwt.getUserFromJWT(authorization);

      if (!user) {
        reply.send({ success: false, message: "Invalid Authorization." });
        return;
      }

      await prisma.key.delete({
        where: {
          key: keyDB?.key,
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: keyDB?.type,
        },
      });

      reply.send({ success: true, message: "Key Redeemed!" });
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
