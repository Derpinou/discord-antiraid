import { AntiRaid } from "./Antiraid";
export interface AntiRaidOptions {
    rateLimit: number;
    time: number;
    ban: boolean;
    kick: boolean;
    unrank: boolean;
    exemptMembers: Array<string>;
    exemptRoles: Array<string>;
    exemptEvent: Array<string>;
    reason: string;
}
export interface Cooldown {
    id?: string;
    guild?: string;
    event?: string;
    startedAt?: number;
    rate?: number;
}
interface ActionTypeObject {
    id: number;
    name: string;
}
declare type djsEvents = 'channelCreate' | 'channelDelete' | 'guildBanAdd' | 'guildMemberRemove' | 'roleCreate' | 'roleDelete';
export declare type ActionType = {
    [key in djsEvents]: ActionTypeObject;
};
export interface AntiRaidEvent {
    name: string;
    run: (client: AntiRaid, ...args: any[]) => Promise<void>;
}
export {};
