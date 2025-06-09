class Notification {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.title = data.title;
        this.message = data.message;
        this.is_read = data.is_read;
        this.created_at = data.created_at;
        this.user = data.user || null;
    }
}

module.exports = Notification;