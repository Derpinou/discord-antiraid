//Example With channelCreate Event
const { Client } = require("discord.js");
const client = new Client();
const {AntiRaid} = require('discord-antiraid');

client.antiraid = new AntiRaid(client, {
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


client.on("channelCreate", async (channel) => {
    let exempt = false,
        event = "channelCreate",
        check = false,
        startAt = Date.now();
    try {
        channel.guild.fetchAuditLogs({type: 10, limit: 10}).then(audit => audit.entries.first()).then(async entry => {
            if (channel.id !== entry.target.id) return undefined;
            let member = channel.guild.members.cache.get(entry.executor.id),
                obje = await client.antiraid.search(member, event);
            exempt = await client.antiraid.checkExempt(member, event);
            if (!exempt) {
                check = await client.antiraid.checkCase(member, event, obje);
                if (check) {
                    return client.antiraid.punish(member);
                }
            }
            await client.antiraid.addCase(member, event, obje, startAt);
        });
    } catch (e) {}
})

client.antiraid.on("punish", (member, reason, sanction) => {
    member.guild.channels.cache.get("848500695506223107").send(`${member.user.username} got banned for raid attempt`)
})

client.login("SUPER_SECRET_TOKEN")