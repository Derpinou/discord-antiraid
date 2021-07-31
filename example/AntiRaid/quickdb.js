const Discord = require('discord.js');
const {AntiRaid} = require('discord-antiraid');
const client = new Discord.Client();
const db = require('quick.db');

//Extend AntiRaid class for edit save(id: String, cooldown: []) and getOptionsFromDB(id: String) with your db methods
class AntiRaidWithDB extends AntiRaid {
    //AntiRaid.save is Optional
    async save(id, cooldown) {
        db.set(`cooldown_${id}`, cooldown)
    }
    //If the bot is public on several guilds and each guilds must have its own antiraid configuration
    async getOptionsFromDB(id) {
        return db.get(`antiraid_${id}`)
    }
}
const antiraid = new AntiRaidWithDB(client, {
    rateLimit: 3,
    time: 10000,
    ban: true,
    kick: false,
    unrank: false,
    exemptMembers: [],
    exemptRoles: [],
    exemptEvent: [],
    reason: "discord-antiraid"
})

antiraid.on("punish", (member, reason, sanction) => {
    member.guild.channels.cache.get(db.get(`logs_${member.guild.id}`)).send(`${member.user.username} got banned for raid attempt`)
})

client.login("SUPER_SECRET_TOKEN")