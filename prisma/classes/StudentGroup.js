class StudentGroup {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.faculty_id = data.faculty_id;
        this.curator_id = data.curator_id;
        this.faculty = data.faculty || null;
        this.curator = data.curator || null;
        this.users = data.users || [];
        this.schedules = data.schedules || [];
        this.messages = data.messages || [];
    }
}

module.exports = StudentGroup;