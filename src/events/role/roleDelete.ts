import {Role, GuildMember, GuildAuditLogs, GuildAuditLogsEntry} from "discord.js"
import {AntiRaid} from "../../Antiraid";
import {Cooldown, AntiRaidEvent} from "../../interfaces";
export const roleDelete: AntiRaidEvent = {
    name: "roleDelete",
    run: async(client: AntiRaid, role: Role) => {
        let exempt: boolean | any = false,
            check: boolean = false;
        const event: string = "roleCreate",
            startAt: number = Date.now();
        try {
            role.guild.fetchAuditLogs({type: client.actionType["roleDelete"].id, limit: 10}).then((audit: GuildAuditLogs) => audit.entries.first()).then(async (entry: GuildAuditLogsEntry | any) => {
                if (role.id !== entry.target.id) return undefined;
                const member: GuildMember | any = role.guild.members.cache.get(entry.executor.id),
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