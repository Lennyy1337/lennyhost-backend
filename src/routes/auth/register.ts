import { fastify } from "../../init/fastify";
import { prisma } from "../../init/prisma";
import bcrypt from "bcrypt";

export async function registerRoute() {
  fastify.post("/auth/register", async function (request, reply) {
    try {
      if (!request.body) {
        reply
          .code(400)
          .send({ success: false, message: "This route requires a JSON body" });
        return;
      }
      const { username, email, password } = request.body as any;
      if (!username || !email || !password) {
        reply
          .code(400)
          .send({ success: false, message: "One or more fields missing." });
        return;
      }
      const verifyEmail = RegExp(
        "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$"
      ).test(email);
      if (!verifyEmail) {
        reply.send({ success: false, message: "Email is not a valid Email" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
          },
        });
      } catch (e) {
        reply.send({ success: false, message: "Account Already exists!" });
        return;
      }
      reply.send({ success: true, message: "Account Created!" });
    } catch (e) {
      reply
        .code(500)
        .send({ success: false, message: "Internal Server Error." });
      console.log("Error in user registration;");
      console.log(e);
    }
  });
}
