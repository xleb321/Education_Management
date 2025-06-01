const fastify = require("fastify")({ logger: true });
const path = require("path");
require("dotenv").config();

// Register plugins
fastify.register(require("./db/client"));
fastify.register(require("./routes/users"));
fastify.register(require("./routes/products"));

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "OK" };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
