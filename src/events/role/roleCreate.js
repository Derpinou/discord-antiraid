module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run (role) {
        let exempt = false,
            event = __filename.split(require('path').sep)[__filename.split(require('path').sep).length - 1].replace('.js', ""),
            check = false,
            startAt = Date.now();
        try {
            role.guild.fetchAuditLogs({type: "ROLE_CREATE"}).then(audit => audit.entries.first()).then(async entry => {
                if (role.id !== entry.id) return undefined;
                let member = role.guild.members.cache.get(entry.executor.id);
                let obje = await this.client.search(member, event);
                exempt = await this.client.checkExempt(member, event);
                if (!exempt) {
                    check = await this.client.checkCase(member, event, obje);
                    if (check === true) {
                        return this.client.punish(member);
                    }
                }
                await this.client.addCase(member, event, obje, startAt);
            });
        } catch (e) {}
    }
}