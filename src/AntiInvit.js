const {EventEmitter} = require('events')
class AntiInvit extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client
        this.options = options
        this.cooldown = [];
        this.client.on("message", async message => {
            let startAt = Date.now();
            let exempt = false
            let obj = {
                invit: false,
                valid: false
            }
            if(/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)){
                let inv;
                let invite = message.content.match(/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/)
                await this.checkExempt(message.member)
                if (!exempt) {
                    obj.invit = true
                    try {
                        inv = await this.client.fetchInvite(invite[0])
                    } catch (e) {
                        obj.valid = false
                    }
                    if (inv) {
                        obj.valid = true
                    }
                    let check = false
                    let obje = await this.search(message.member)
                    if (obje && obje.rate >= this.options.rateLimit) {
                        check = true
                    }
                    if (check === true) {
                        return this.punish(message.member)
                    }
                    if (!obj.valid && options.invalid) {
                        await this.addCase(message.member, obje, startAt)
                    }
                    if (obj.valid) {
                        await this.addCase(message.member, obje, startAt)
                    }
                }
            }
        })
    }
    async checkInvit (message) {
        let obj = {
            invit: false,
            valid: false
        }
        if(/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)){
            let inv;
            obj.invit = true
            let invite = message.content.match(/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/)
            try {
                inv = await this.client.fetchInvite(invite[0])
            } catch (e) {
                obj.valid = false
            }
            if (inv) {
                obj.valid = true
                obj.guild = inv.guild
                obj.channel = inv.channel
                obj.inviter = inv.inviter
                obj.code = inv.code
                obj.arg = invite
            }
        }
        return obj
    }
    async checkCase() {

    }
    async punish(member) {
        if (this.options.ban) {
            return member.send("je te ban")//await message.member.ban({reason: options.reason})
        } else if (this.options.kick) {
            return member.send("je te kick")//await message.member.kick(options.reason)
        }
    }
    async addCase (member, obje, startAt) {
        this.cooldown.push({
            id: member.id,
            guild: member.guild.id,
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
    async checkExempt (member) {
        if (this.options.exemptMembers > 0 || this.options.exemptRoles > 0) {
            this.options.exemptRoles.forEach(r => {
                if (member.roles.cache.has(r)) return true
            })
            if (this.options.exemptMembers.includes(member.id)) return true
        }
    }
    async search(member) {
        return this.cooldown.find(c => c.id === member.id && c.guild === member.guild.id)
    }
}
module.exports = AntiInvit
