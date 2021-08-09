import {GuildMember, GuildAuditLogs, GuildAuditLogsEntry, Guild, User} from "discord.js"
import {AntiRaid} from "../../Antiraid";
import {Cooldown, AntiRaidEvent} from "../../interfaces";
export const guildBanAdd: AntiRaidEvent = {
    name: "guildBanAdd",
    run: async(client: AntiRaid, guild: Guild, user: User) => {
        let exempt: boolean | any = false,
            check: boolean = false;
        const event: string = "guildBanAdd",
            startAt: number = Date.now();
        try {
            guild.fetchAuditLogs({type: client.actionType["guildBanAdd"].id, limit: 10}).then((audit: GuildAuditLogs) => audit.entries.first()).then(async (entry: GuildAuditLogsEntry | any) => {
                if (user.id !== entry.target.id) return undefined;
                const executor: GuildMember | any = guild.members.cache.get(entry.executor.id),
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