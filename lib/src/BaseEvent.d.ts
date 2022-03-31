import { AntiRaidManager } from './AntiRaidManager';
import { AntiRaidManagerOptions, EventsNames } from './interfaces';
import { GuildMember } from 'discord.js';
export declare abstract class BaseEvent {
    protected _manager: AntiRaidManager;
    name: EventsNames;
    constructor(manager: AntiRaidManager, filename: string);
    protected abstract run(...args: any[]): void;
    protected checkEvent(options: AntiRaidManagerOptions): boolean;
    protected checkUser(options: AntiRaidManagerOptions, memberId: string): boolean;
    protected checkRoles(options: AntiRaidManagerOptions, member: GuildMember): boolean;
    protected antiraid(guildId: string, event: string, startAt: number, targetId: string): Promise<void>;
}
