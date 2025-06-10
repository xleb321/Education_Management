class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.password_hash = data.password_hash;
        this.email = data.email;
        this.full_name = data.full_name;
        this.faculty_id = data.faculty_id;
        this.group_id = data.group_id;
        this.created_at = data.created_at;
        this.is_active = data.is_active;

        // Relations
        this.roles = data.roles || [];
        this.faculty = data.faculty || null;
        this.group = data.group || null;
        this.faculties_dean = data.faculties_dean || [];
        this.groups_curator = data.groups_curator || [];
        this.exams_teacher = data.exams_teacher || [];
        this.materials_uploaded = data.materials_uploaded || [];
        this.access_cards = data.access_cards || [];
        this.attendance = data.attendance || [];
        this.messages_sent = data.messages_sent || [];
        this.messages_received = data.messages_received || [];
        this.applications = data.applications || [];
        this.applications_resolved = data.applications_resolved || [];
        this.scholarships_received = data.scholarships_received || [];
        this.scholarships_approved = data.scholarships_approved || [];
        this.notifications = data.notifications || [];
        this.grades = data.grades || [];
        this.schedules_taught = data.schedules_taught || [];
    }
}

module.exports = User;