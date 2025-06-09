class Message {
    constructor(data) {
        this.id = data.id;
        this.sender_id = data.sender_id;
        this.recipient_id = data.recipient_id;
        this.group_id = data.group_id;
        this.content = data.content;
        this.sent_at = data.sent_at;
        this.is_read = data.is_read;
        this.sender = data.sender || null;
        this.recipient = data.recipient || null;
        this.group = data.group || null;
    }
}

module.exports = Message;