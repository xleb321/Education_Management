class Scholarship {
    constructor(data) {
        this.id = data.id;
        this.student_id = data.student_id;
        this.type = data.type;
        this.amount = data.amount;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.is_active = data.is_active;
        this.approved_by_id = data.approved_by_id;
        this.student = data.student || null;
        this.approved_by = data.approved_by || null;
    }
}

module.exports = Scholarship;