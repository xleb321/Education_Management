import Fastify from "fastify";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// JWT setup
fastify.register(jwt, { secret: process.env.JWT_SECRET });

// Test route
fastify.get("/", async (req, reply) => {
  return { message: "hello world" };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
