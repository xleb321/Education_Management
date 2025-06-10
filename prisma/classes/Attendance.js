class Attendance {
    constructor(data) {
        this.id = data.id;
        this.student_id = data.student_id;
        this.date = data.date;
        this.entry_time = data.entry_time;
        this.exit_time = data.exit_time;
        this.status = data.status;
        this.student = data.student || null;
    }
}

module.exports = Attendance;