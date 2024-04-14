import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../../init/fastify";
import { prisma } from "../../init/prisma";
import bcrypt from "bcrypt";
import { APP_CONSTANTS } from "../../config";

export async function registerRoute() {
  fastify.post(
    "/auth/register",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { username, email, password } = request.body as any;

      try {
        if (!username || !email || !password) {
          return reply
            .code(400)
            .send({ success: false, message: "One or more fields missing." });
        }

        const verifyEmail = RegExp(
          "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$"
        ).test(email);

        if (!verifyEmail) {
          return reply
            .status(400)
            .send({ success: false, message: "Email is not a valid Email" });
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        if (existingUser) {
          return reply
            .status(400)
            .send({ success: false, message: "Account Already exists!" });
        }

        const hashedPassword = await bcrypt.hash(
          password,
          APP_CONSTANTS.SALT_ROUNDS
        );

        await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
          },
        });

        reply.send({ success: true, message: "Account Created!" });
      } catch (e) {
        reply
          .code(500)
          .send({ success: false, message: "Internal Server Error." });
        request.log.error(e);
      }
    }
  );
}
