module.exports = class {
    constructor(client) {
        this.client = client
    }
    async run (guild, user) {
        let exempt = false,
            event = "guildBanAdd",
            check = false,
            startAt = Date.now();
        if (this.client.options.exemptEvent.includes(event)) return undefined
        guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(audit => audit.entries.first()).then(async entry => {
            let member = guild.members.cache.get(entry.executor.id)
            let obje = await this.client.search(member, event);
            exempt = await this.client.checkExempt(member)
            if (!exempt) {
                check = await this.client.checkCase(member, event, obje)
                if (check === true) {
                    return this.client.punish(member)
                }
            }
            await this.client.addCase(member, event, obje, startAt)
        })
    }
}