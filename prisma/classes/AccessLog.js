class AccessLog {
    constructor(data) {
        this.id = data.id;
        this.card_id = data.card_id;
        this.access_time = data.access_time;
        this.status = data.status;
        this.card = data.card || null;
    }
}

module.exports = AccessLog;