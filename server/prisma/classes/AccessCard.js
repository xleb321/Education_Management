class AccessCard {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.card_id = data.card_id;
        this.valid_until = data.valid_until;
        this.is_active = data.is_active;
        this.user = data.user || null;
        this.access_logs = data.access_logs || [];
    }
}

module.exports = AccessCard;