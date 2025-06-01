const User = require("../db/models/User");

class UserService {
  constructor() {
    this.userModel = new User();
  }

  async getAllUsers() {
    return this.userModel.findAll();
  }

  async getUserById(id) {
    return this.userModel.findById(id);
  }

  async createUser(userData) {
    return this.userModel.create(userData);
  }
}

module.exports = UserService;
