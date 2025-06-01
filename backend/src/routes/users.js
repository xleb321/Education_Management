const fp = require("fastify-plugin");
const UserService = require("../services/UserService");

async function userRoutes(fastify) {
  const userService = new UserService();

  fastify.get("/users", async () => {
    return userService.getAllUsers();
  });

  fastify.get("/users/:id", async (request) => {
    const { id } = request.params;
    return userService.getUserById(id);
  });

  fastify.post("/users", async (request) => {
    return userService.createUser(request.body);
  });
}

module.exports = fp(userRoutes);
