
module.exports = class {
    constructor(client) {
        this.client = client
    }
    async run (emoji) {
        let exempt = false,
            event = "emojiCreate",
            check = false,
            startAt = Date.now();
        if (this.client.options.exemptEvent.includes(event)) return undefined
        emoji.guild.fetchAuditLogs({type: "EMOJI_CREATE"}).then(audit => audit.entries.first()).then(async entry => {
            let member = emoji.guild.members.cache.get(entry.executor.id)
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