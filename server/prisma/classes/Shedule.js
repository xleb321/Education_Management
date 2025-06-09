class Schedule {
    constructor(data) {
        this.id = data.id;
        this.subject_id = data.subject_id;
        this.group_id = data.group_id;
        this.teacher_id = data.teacher_id;
        this.room = data.room;
        this.day_of_week = data.day_of_week;
        this.start_time = data.start_time;
        this.end_time = data.end_time;
        this.is_even_week = data.is_even_week;
        this.valid_from = data.valid_from;
        this.valid_until = data.valid_until;
        this.subject = data.subject || null;
        this.group = data.group || null;
        this.teacher = data.teacher || null;
    }
}

module.exports = Schedule;