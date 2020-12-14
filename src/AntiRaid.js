const {EventEmitter} = require('events'),
    Handler = require('./Handler');
class AntiRaid extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        this.cooldown = [];
        this.handler = new Handler(this);
        this.handler.load()
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
        if (obje && obje.rate >= this.options.rateLimit -1) {
            return true
        }
    }
    async punish(member) {
        if (this.options.ban) {
            return await member.ban({reason: this.options.reason})
        } else if (this.options.kick) {
            return await member.member.kick(this.options.reason)
        }
    }
    async checkExempt (member, event) {
        if (this.options.exemptMembers > 0 || this.options.exemptRoles > 0) {
            this.options.exemptRoles.forEach(r => {
                if (member.roles.cache.has(r)) return true
            })
            if (this.options.exemptMembers.includes(member.id)) return true
            if (this.options.exemptEvent.includes(event)) return true
        }
    }
    async search(member, event) {
        let search = this.cooldown.find(c => c.id === member.id && c.guild === member.guild.id && c.event === event)
        console.log(search)
        return search
    }
}
module.exports = AntiRaid;