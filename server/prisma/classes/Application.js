class Application {
    constructor(data) {
        this.id = data.id;
        this.applicant_id = data.applicant_id;
        this.type = data.type;
        this.status = data.status;
        this.content = data.content;
        this.created_at = data.created_at;
        this.resolved_at = data.resolved_at;
        this.resolved_by_id = data.resolved_by_id;
        this.applicant = data.applicant || null;
        this.resolved_by = data.resolved_by || null;
    }
}

module.exports = Application;