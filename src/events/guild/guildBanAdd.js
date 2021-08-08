const {sep} = require('path');
module.exports = class guildBanAdd {
    constructor(client) {
        this.client = client;
    }
    async run (guild, user) {
        let exempt = false,
            check = false;
        const event = __filename.split(sep)[__filename.split(sep).length - 1].replace('.js', ""),
            startAt = Date.now();
        try {
            guild.fetchAuditLogs({type: this.client.actionType[event].id, limit: 10}).then(audit => audit.entries.first()).then(async entry => {
                if (user.id !== entry.target.id) return undefined;
                const member = guild.members.cache.get(entry.executor.id),
                    obje = await this.client.search(member, event);
                exempt = await this.client.checkExempt(member, event);
                if (!exempt) {
                    check = await this.client.checkCase(member, event, obje);
                    if (check) {
                        return this.client.punish(member);
                    }
                }
                await this.client.addCase(member, event, obje, startAt);
            });
        } catch (e) {}
    }
}
