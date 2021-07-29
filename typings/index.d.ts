declare module 'discord-antiraid' {
    import { EventEmitter } from 'events';
    import {
        Client,
        Collection,
        GuildMember
    } from 'discord.js'
    interface Cooldown {
        id: string;
        guild: string;
        event: string;
        startedAt: number;
        rate: number;
    }
    interface ActionTypeObject {
        id: number;
        name: string;
    }
    type djsEvents = 'channelCreate'|'channelDelete'|'guildBanAdd'|'guildMemberRemove'|'roleCreate'|'roleDelete';
    type ActionType = {
        [key in djsEvents]: ActionTypeObject;
    };

    interface AntiRaidOptions {
        rateLimit: number
        time: number
        ban: boolean
        kick: boolean
        unrank: boolean
        exemptMembers: Array<string>
        exemptRoles: Array<string>
        exemptEvent: Array<string>
        reason: string
    }
    interface AntiRaidEvents {
        'punish': (member: GuildMember, reason: AntiRaidOptions["reason"], sanction: string)  => void;
    }
    export class AntiRaid extends EventEmitter {
        constructor(client: Client, options: AntiRaidOptions);
        public client: Client;
        public options: AntiRaidOptions;
        public cooldown: Collection<string, Array<Cooldown>>;
        public actionType: ActionType
        private init(): void;
        public addCase(member: GuildMember, event: string, obje: Cooldown, startAt: number): void;
        public checkCase (member: GuildMember, event: string, obje: Cooldown): boolean;
        public punish(member: GuildMember): void;
        public save(id: string, cooldownToSave: Array<Cooldown>): void;
        public getOptionsFromDB (id: string): AntiRaidOptions;
        public getCooldown(id: string): Array<Cooldown>;
        public saveCooldown(id: string, cooldownToSave: Array<Cooldown>): void;
        public checkExempt(member: GuildMember, event: string): boolean;
        public search(member: GuildMember, event: string): Cooldown;
        on<U extends keyof AntiRaidEvents>(
            event: U, listener: AntiRaidEvents[U]
        ): this;
        public once<K extends keyof AntiRaidEvents>(
            event: K,
            listener: AntiRaidEvents[K]
        ): this;

        emit<U extends keyof AntiRaidEvents>(
            event: U, ...args: Parameters<AntiRaidEvents[U]>
        ): boolean;
    }

}

