const {EventEmitter} = require('events')
class AntiInvit extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client
        this.options = options
        this.cooldown = [];
        async function checkCase(message, startAt) {

        }
        async function addCase(message, startAt) {
            this.cooldown.push({
                id: message.author.id,
                guild: message.guild.id,
                startedAt: startAt,
            })

            let index = this.cooldown.indexOf({
                id: message.author.id,
                startedAt: startAt
            })
            setTimeout(async () => {
                this.cooldown.splice(index)
            }, this.options.time || 10000)
        }
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
                if (options.exemptMembers > 0 || options.exemptRoles > 0) {
                    options.exemptRoles.forEach(r => {
                        if (message.member.roles.cache.has(r)) return exempt = true
                    })
                    if (options.exemptMembers.includes(message.member.id)) return exempt = true
                }
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
                    let check = await checkCase(message, startAt)
                    if (check === true && options.ban) {
                        return await message.member.ban({reason: options.reason})
                    } else if (check === true && options.kick) {
                        return await message.member.kick(options.reason)
                    }
                    if (options.invalid && !obj.valid) {
                        return addCase(message, startAt);
                    }
                    if (obj.valid) {
                        return addCase(message, startAt);
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
}
module.exports = AntiInvit
