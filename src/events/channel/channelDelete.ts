import {GuildChannel, GuildMember, GuildAuditLogs, GuildAuditLogsEntry} from "discord.js"
import {AntiRaid} from "../../Antiraid";
import {Cooldown, AntiRaidEvent} from "../../interfaces";
export const channelDelete: AntiRaidEvent = {
    name: "channelDelete",
    run: async(client: AntiRaid, channel: GuildChannel) => {
        let exempt: boolean | any = false,
            check: boolean = false;
        const event: string = "channelDelete",
            startAt: number = Date.now();
        try {
            channel.guild.fetchAuditLogs({type: client.actionType["channelDelete"].id, limit: 10}).then((audit: GuildAuditLogs) => audit.entries.first()).then(async (entry: GuildAuditLogsEntry | any) => {
                if (channel.id !== entry.target.id) return undefined;
                const member: GuildMember | any = channel.guild.members.cache.get(entry.executor.id),
                    caseToCheck: Cooldown = await client.search(member, event);
                exempt = await client.checkExempt(member, event);
                if (!exempt) {
                    check = await client.punishable(member, caseToCheck);
                    if (check) {
                        return client.punish(member);
                    }
                }
                await client.addCaseToCooldown(member, event, caseToCheck, startAt);
            });
        } catch (e) {console.error(e)}
    }
}