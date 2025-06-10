class UserRole {
    constructor(data) {
        this.user_id = data.user_id;
        this.role_id = data.role_id;
        this.user = data.user || null;
        this.role = data.role || null;
    }
}

module.exports = UserRole;