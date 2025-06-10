class Exam {
    constructor(data) {
        this.id = data.id;
        this.subject_id = data.subject_id;
        this.exam_date = data.exam_date;
        this.teacher_id = data.teacher_id;
        this.subject = data.subject || null;
        this.teacher = data.teacher || null;
        this.grades = data.grades || [];
    }
}

module.exports = Exam;