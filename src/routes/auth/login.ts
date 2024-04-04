import { fastify } from "../../init/fastify";
import { jwt } from "../../init/jwt";
import { prisma } from "../../init/prisma";
import bcrypt from "bcrypt";

export async function loginRoute() {
  fastify.post("/auth/login", async function (request, reply) {
    if (!request.body) {
      reply
        .code(400)
        .send({ success: false, message: "This route requires a JSON body" });
      return;
    }
    const { email, password } = request.body as any;
    if (!email || !password) {
      reply
        .code(400)
        .send({ success: false, message: "One or more fields missing." });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!(await bcrypt.compare(password, user!.password))) {
        reply.send({ success: false, message: "Invalid Password." });
        return;
      }

      const jwtToken = await jwt.signToken(user!, "4d");
      reply.send({ success: true, message: "Logged in!", data: jwtToken });
    } catch (e) {
      reply.send({ success: false, message: "No user found with that email." });
      return;
    }
  });
}
