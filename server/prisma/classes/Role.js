class Role {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.userRoles = data.userRoles || [];
    }
}

module.exports = Role;