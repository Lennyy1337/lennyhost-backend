import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../../init/fastify";
import { jwt } from "../../init/jwt";
import { prisma } from "../../init/prisma";
import bcrypt from "bcrypt";

export async function loginRoute() {
  fastify.post(
    "/auth/login",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { email, password } = request.body as any;

      if (!email || !password) {
        return reply
          .code(400)
          .send({ success: false, message: "One or more fields missing." });
      }

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return reply
            .status(404)
            .send({
              success: false,
              message: "No user found with that email.",
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
          return reply
            .status(403)
            .send({ success: false, message: "Invalid Password." });
        }

        const token = await jwt.signToken(user, "4d");

        return reply.status(200).send({
          success: true,
          message: "Logged in!",
          data: token,
        });
      } catch (e) {
        console.error("Error during login:", e);
        return reply
          .status(500)
          .send({ success: false, message: "Internal Server Error." });
      }
    }
  );
}
