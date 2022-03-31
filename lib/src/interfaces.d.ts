export interface AntiRaidManagerOptions {
    enabled: boolean;
    events: EventsNames[];
    exemptedUsers: string[];
    exemptedRoles: string[];
    rateLimit: number;
    time: number;
    sanction: sanctionType;
    reason: string;
}
export declare type EventsNames = 'channelCreate' | 'channelDelete' | 'guildBanAdd' | 'guildBanRemove' | 'roleCreate' | 'roleDelete' | 'threadCreate' | 'guildMemberRemove' | 'threadDelete';
export declare type ActionType = {
    [key in EventsNames]: number;
};
export declare type sanctionType = 'ban' | 'kick' | 'removeAllRoles';
export interface Case {
    user: string;
    guild: string;
    event: string;
    startedAt: number;
    rate: number;
}
export interface AntiraidManagerEvents {
    'addcase': (memberId: string, guildId: string, event: string, oldCase: Case) => void;
    'sanction': (memberId: string, guildId: string) => void;
    'error': (error: string) => void;
}
