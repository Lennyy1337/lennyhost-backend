import dotenv from "dotenv";
import { fastify } from "./init/fastify";
import { router } from "./router";

import multipart from "@fastify/multipart";

import fastifyStatic from "@fastify/static";

import * as path from "path";
import fs from "fs";

import ratelimit from "@fastify/rate-limit";

dotenv.config();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

fastify.register(ratelimit, {
  max: 10,
  ban: 3,
  timeWindow: "1 minute",
});

router();

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../uploads"),
  prefix: "/uploads",
});

fastify.get("/uploads/:filekey", async function (req, reply) {
  const { filekey } = req.params as any;
  const filextension = filekey.split(".").pop();
  if (filextension == "sxcu") {
    await reply.download(filekey);
    fs.rmSync(`uploads/${filekey}`);
    return;
  }
  reply.sendFile(filekey);
});

fastify.get("/", function (req, reply) {
  reply.redirect("https://lenny.host");
});

fastify.register(multipart, {
  limits: {
    fileSize: 524288000,
  },
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
  console.log(`LennyHost Listening on ${address}`);
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
