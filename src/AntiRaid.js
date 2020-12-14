const {EventEmitter} = require('events'),
    {readdirSync} = require('fs'),
    {sep} = require('path');
class AntiRaid extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        this.cooldown = [];
        //Handler by Freiik: https://github.com/FreiikDev/discord-addons/blob/main/src/structures/handlersManager.js
        let source = `${__dirname}${sep}events${sep}`;
        readdirSync(source).forEach((dir) => {
            if (dir[0] !== ".") {
                readdirSync(source + dir)
                    .filter((f) => f.endsWith(".js"))
                    .forEach((f, i) => {
                        try {
                            const event = new (require(`./events/${dir}/${f}`))(this);
                            this.client.on(f.split(".")[0], (...args) => event.run(...args));
                        } catch (error) {
                            console.log(error);
                        }
                    });
            }
        });
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
            return await member.kick(this.options.reason)
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
        return this.cooldown.find(c => c.id === member.id && c.guild === member.guild.id && c.event === event)
    }
}
module.exports = AntiRaid;