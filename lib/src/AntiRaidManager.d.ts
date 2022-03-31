/// <reference types="node" />
import { EventEmitter } from 'events';
import { Client, Collection, GuildMember } from 'discord.js';
import { AntiraidManagerEvents, AntiRaidManagerOptions, Case } from './interfaces';
import { AxiosInstance } from 'axios';
export declare class AntiRaidManager extends EventEmitter {
    _client: Client;
    private _options;
    _request: AxiosInstance;
    cases: Collection<string, Case[]>;
    constructor(client: Client, options?: AntiRaidManagerOptions);
    on<U extends keyof AntiraidManagerEvents>(event: U, listener: AntiraidManagerEvents[U]): this;
    emit<U extends keyof AntiraidManagerEvents>(event: U, ...args: Parameters<AntiraidManagerEvents[U]>): boolean;
    private _handleEvents;
    getOptionsFromDb(id: string): AntiRaidManagerOptions;
    addCase(options: AntiRaidManagerOptions, user: string, guild: string, event: string, startedAt: number, oldCase: Case): void;
    getCases(id: string): Case[];
    search(member: GuildMember, event: string): Case | undefined;
    punishable(options: AntiRaidManagerOptions, caseToCheck: Case): boolean;
    ban(guild: string, member: string, reason: string): Promise<void>;
    kick(guild: string, member: string, reason: string): Promise<void>;
    removeRoles(guild: string, member: string, reason: string): Promise<void>;
}
