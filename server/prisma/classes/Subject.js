class Subject {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.faculty_id = data.faculty_id;
        this.faculty = data.faculty || null;
        this.exams = data.exams || [];
        this.materials = data.materials || [];
        this.schedules = data.schedules || [];
    }
}

module.exports = Subject;