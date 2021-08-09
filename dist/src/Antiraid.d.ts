/// <reference types="node" />
import { Client, Collection, GuildMember } from "discord.js";
import { EventEmitter } from "events";
import { AntiRaidOptions, Cooldown, ActionType } from "./interfaces";
/**
 * AntiRaid
 */
declare class AntiRaid extends EventEmitter {
    readonly client: Client;
    options: AntiRaidOptions;
    cooldown: Collection<string, Array<Cooldown>>;
    readonly actionType: ActionType;
    /**
     * @param {Client} client The Discord Client
     * @param {AntiRaidOptions} options The Antiraid options
     */
    constructor(client: Client, options: AntiRaidOptions);
    /**
     * Load Events Files and Add Events Listeners
     * @ignore
     * @private
     */
    init(): void;
    /**
     * Add Case to Cooldown
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @param {Cooldown} oldCase Old Cooldown object
     * @param {number} startAt Timestamp of Event
     * @return {Promise<any>}
     */
    addCaseToCooldown(member: GuildMember, event: string, oldCase: Cooldown, startAt: number): Promise<any>;
    /**
     * Check if member is eligible to sanction
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {Cooldown} caseToCheck Cooldown object to check
     * @return {Promise<boolean>} Member is eligible to sanction
     */
    punishable(member: GuildMember, caseToCheck: Cooldown): Promise<boolean>;
    /**
     * Ban, kick or Remove all roles of member
     * @param {GuildMember} member Discord GuildMember resolvable
     * @return {Promise<any>}
     * @example
     * antiraid.punish(Member)
     */
    punish(member: GuildMember): Promise<any>;
    /**
     * Get Guild Options from DB
     * @param {string} id Discord Guild ID
     * @return {AntiRaidOptions} AntiRaid Options get from DB
     */
    getOptionsFromDB(id: string): Promise<AntiRaidOptions>;
    /**
     * Get Cooldown Array from Antiraid Cache
     * @param {string} id Discord Guild ID
     * @return {Array<Cooldown>}
     */
    getCooldown(id: string): Array<Cooldown> | any;
    /**
     * Save Cooldown Array to Cache
     * @param {string} id Discord Guild ID
     * @param {Array<Cooldown>} cooldownToSave
     * @return {void}
     */
    saveCooldown(id: string, cooldownToSave: Array<Cooldown>): void;
    /**
     * Check If member or event is exempted or if member has exempted role
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {string} [event] Event Name
     * @return {boolean}
     * @example
     * let member = message.guild.members.cache.get("id");
     * antiraid.checkExempt(member)
     */
    checkExempt(member: GuildMember, event?: string): Promise<true | undefined>;
    /**
     * Get Member's cases from cache
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @return {Cooldown} Member's Cases fetched from cache
     */
    search(member: GuildMember, event: string): Cooldown | any;
}
export { AntiRaid };
