class StudyMaterial {
    constructor(data) {
        this.id = data.id;
        this.subject_id = data.subject_id;
        this.title = data.title;
        this.file_path = data.file_path;
        this.upload_date = data.upload_date;
        this.uploaded_by_id = data.uploaded_by_id;
        this.subject = data.subject || null;
        this.uploaded_by = data.uploaded_by || null;
    }
}

module.exports = StudyMaterial;