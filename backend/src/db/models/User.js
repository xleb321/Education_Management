const Model = require("./index");

class User extends Model {
  constructor() {
    super("users");
  }

  async findByEmail(email) {
    const { rows } = await this.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  }
}

module.exports = User;
