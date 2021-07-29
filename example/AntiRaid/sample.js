const {AntiRaid} = require('discord-antiraid');

const antiraid = new AntiRaid(client, {
    rateLimit: 5,
    time: 15000,
    ban: false,
    kick: false,
    unrank: true,
    exemptMembers: [],
    exemptRoles: [],
    exemptEvent: [],
    reason: "discord-antiraid"
})

antiraid.on("punish", (member, reason, sanction) => {
    member.guild.channels.cache.get("848500695506223107").send(`${member.user.username} got banned for raid attempt`)
})