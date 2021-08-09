import {GuildMember, GuildAuditLogs, GuildAuditLogsEntry} from "discord.js"
import {AntiRaid} from "../../Antiraid";
import {Cooldown, AntiRaidEvent} from "../../interfaces";
export const guildMemberRemove: AntiRaidEvent = {
    name: "guildMemberRemove",
    run: async(client: AntiRaid, member: GuildMember) => {
        let exempt: boolean | any = false,
            check: boolean = false;
        const event: string = "guildMemberRemove",
            startAt: number = Date.now();
        try {
            member.guild.fetchAuditLogs({type: client.actionType["guildMemberRemove"].id, limit: 10}).then((audit: GuildAuditLogs) => audit.entries.first()).then(async (entry: GuildAuditLogsEntry | any) => {
                if (member.id !== entry.target.id) return undefined;
                const executor: GuildMember | any = member.guild.members.cache.get(entry.executor.id),
                    caseToCheck: Cooldown = await client.search(executor, event);
                exempt = await client.checkExempt(executor, event);
                if (!exempt) {
                    check = await client.punishable(executor, caseToCheck);
                    if (check) {
                        return client.punish(executor);
                    }
                }
                await client.addCaseToCooldown(executor, event, caseToCheck, startAt);
            });
        } catch (e) {console.error(e)}
    }
}