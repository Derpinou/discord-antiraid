//Example With channelCreate Event
module.exports = {
    async run (channel) {
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
    }
}