class Grade {
    constructor(data) {
        this.id = data.id;
        this.student_id = data.student_id;
        this.exam_id = data.exam_id;
        this.grade = data.grade;
        this.passed = data.passed;
        this.student = data.student || null;
        this.exam = data.exam || null;
    }
}

module.exports = Grade;