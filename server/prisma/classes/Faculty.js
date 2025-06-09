class Faculty {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.dean_id = data.dean_id;
        this.dean = data.dean || null;
        this.groups = data.groups || [];
        this.subjects = data.subjects || [];
        this.users = data.users || [];
    }
}

module.exports = Faculty;