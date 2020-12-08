const {EventEmitter} = require('events');
class AntiRaid extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        this.cooldown = [];
        this.client.on("channelDelete", channel => {
            let exempt = false,
                event = "channelDelete",
                check = false,
                startAt = Date.now();
            channel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(audit => audit.entries.first()).then(async entry => {
                if (channel.id !== entry.id) return undefined
                let member = channel.guild.members.cache.get(entry.executor.id)
                let obje = this.cooldown.find(c => c.id === member.id && c.guild === member.guild.id && c.event === event)
                exempt = await this.checkExempt(member)
                if (!exempt) {
                    check = await this.checkCase(member, event, obje)
                    if (check === true) {
                        return this.punish(member)
                    }
                }
                await this.addCase(member, event, obje, startAt)
                console.log(obje)
            })
        })
    }
    async addCase (member, event, obje, startAt) {
        this.cooldown.push({
            id: member.id,
            guild: member.guild.id,
            event: event,
            startedAt: startAt,
            rate: obje ? obje.rate++ : 1
        })
        let index = this.cooldown.indexOf({
            id: member.id,
            startedAt: startAt
        })
        setTimeout(async () => {
            this.cooldown.splice(index)
        }, this.options.time || 10000)
    }
    async checkCase (member, event, obje) {
        if (obje && obje.rate >= this.options.rateLimit) {
            return true
        }
    }
    async punish(member) {
        if (this.options.ban) {
            return member.send("je te ban")//await message.member.ban({reason: options.reason})
        } else if (this.options.kick) {
            return member.send("je te kick")//await message.member.kick(options.reason)
        }
    }
    async checkExempt (member) {
        if (this.options.exemptMembers > 0 || this.options.exemptRoles > 0) {
            this.options.exemptRoles.forEach(r => {
                if (member.roles.cache.has(r)) return true
            })
            if (this.options.exemptMembers.includes(member.id)) return true
        }
    }
}
module.exports = AntiRaid;