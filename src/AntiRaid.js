const {EventEmitter} = require('events'),
    {readdir} = require('fs');
class AntiRaid extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        this.cooldown = [];
        readdir("./src/events", (err, files) => {
            if (!files) return;
            if (err) this.client.emit("error", err);
            for (const dir of files) {
                readdir(`./src/events/${dir}`, (err, file) => {
                    if (!file) return;
                    if (err) this.client.emit("error", err);
                    for (const evt of file) {
                        try {
                            if (!evt) return;
                            const event = new (require(`./events/${dir}/${evt}`))(this);
                            console.log(`${evt} chargé`);
                            this.client.on(evt.split(".")[0], (...args) => event.run(...args));
                        } catch (e) {
                        }
                    }
                })
            }
        });
        return this
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
    async search(member, event) {
        return this.cooldown.find(c => c.id === member.id && c.guild === member.guild.id && c.event === event)
    }
}
module.exports = AntiRaid;