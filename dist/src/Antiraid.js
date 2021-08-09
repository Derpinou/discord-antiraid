"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiRaid = void 0;
const discord_js_1 = require("discord.js");
const events_1 = require("events");
const fs_1 = require("fs");
const path_1 = require("path");
const Constants_1 = require("./Constants");
/**
 * AntiRaid
 */
class AntiRaid extends events_1.EventEmitter {
    /**
     * @param {Client} client The Discord Client
     * @param {AntiRaidOptions} options The Antiraid options
     */
    constructor(client, options) {
        super();
        if (!client)
            throw new Error('Client is a required option.');
        /**
         * The Discord Client
         * @type {Client}
         */
        this.client = client;
        /**
         * The Antiraid options
         * @type {AntiRaidOptions}
         */
        this.options = options || Constants_1.defaultAntiRaidOptions;
        /**
         * The Antiraid cooldown
         * @type {Collection}
         */
        this.cooldown = new discord_js_1.Collection();
        /**
         * The Discord Audit Logs Action Type
         * @type {AUDIT_LOG}
         */
        this.actionType = Constants_1.AUDIT_LOG;
        this.init();
    }
    /**
     * Load Events Files and Add Events Listeners
     * @ignore
     * @private
     */
    init() {
        fs_1.readdirSync(`${__dirname}${path_1.sep}events${path_1.sep}`).forEach((dir) => {
            if (dir[0] !== ".") {
                fs_1.readdirSync(`${__dirname}${path_1.sep}events${path_1.sep}${dir}`)
                    .filter((f) => f.endsWith(".js"))
                    .forEach((f, i) => {
                    try {
                        const event = require(`./events/${dir}/${f}`)[f.replace(".js", "")];
                        this.client.on(event.name, event.run.bind(null, this));
                    }
                    catch (error) {
                        console.error(error);
                    }
                });
            }
        });
    }
    /**
     * Add Case to Cooldown
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @param {Cooldown} oldCase Old Cooldown object
     * @param {number} startAt Timestamp of Event
     * @return {Promise<any>}
     */
    addCaseToCooldown(member, event, oldCase, startAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.getOptionsFromDB(member.guild.id);
            if (!options || typeof options !== "object")
                throw new Error("Options need to be valid object");
            const cooldown = this.getCooldown(member.guild.id);
            cooldown.push({
                id: member.id,
                guild: member.guild.id,
                event: event,
                startedAt: startAt,
                rate: oldCase && oldCase.rate ? oldCase.rate++ : 1
            });
            this.saveCooldown(member.guild.id, cooldown);
            let index = cooldown.indexOf({
                id: member.id,
                startedAt: startAt
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                cooldown.splice(index);
            }), options.time || 10000);
            this.saveCooldown(member.guild.id, cooldown);
        });
    }
    /**
     * Check if member is eligible to sanction
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {Cooldown} caseToCheck Cooldown object to check
     * @return {Promise<boolean>} Member is eligible to sanction
     */
    punishable(member, caseToCheck) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.getOptionsFromDB(member.guild.id);
            if (!options || typeof options !== "object")
                throw new Error("Options need to be valid object");
            if (!options || !options.rateLimit)
                throw new Error("Cannot found options.rateLimit");
            // @ts-ignore
            return caseToCheck && caseToCheck.rate >= options.rateLimit - 1;
        });
    }
    /**
     * Ban, kick or Remove all roles of member
     * @param {GuildMember} member Discord GuildMember resolvable
     * @return {Promise<any>}
     * @example
     * antiraid.punish(Member)
     */
    punish(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.getOptionsFromDB(member.guild.id);
            if (!options || typeof options !== "object")
                throw new Error("Options need to be valid object");
            if (!options.ban && !options.kick && !options.unrank)
                throw new Error("Please provide sanction between ban, kick or unrank (boolean)");
            if (options.ban) {
                return member.ban({ reason: options.reason });
            }
            else if (options.kick) {
                return member.kick(options.reason);
            }
            if (options.unrank) {
                member.roles.cache.forEach(role => {
                    member.roles.remove(role).catch(e => null);
                });
            }
            /**
             * Emitted when a member got punished.
             * @event AntiRaid#punish
             * @param {GuildMember} member Discord GuildMember resolvable
             * @param {AntiRaidOptions.reason} reason Punishment reason
             * @param {string} sanction Sanction type (ban|kick|unrank)
             * @example
             * // Print args in Console
             *   antiraid.on("punish", (member, reason, sanction) => {
             *       member.guild.channels.cache.get("848500695506223107").send(`${member.user.username} got banned for raid attempt`)
             *   })
             *
             */
            this.emit("punish", member, options.reason, options.ban ? "ban" : options.kick ? "kick" : options.unrank ? "unrank" : false);
        });
    }
    /**
     * Get Guild Options from DB
     * @param {string} id Discord Guild ID
     * @return {AntiRaidOptions} AntiRaid Options get from DB
     */
    getOptionsFromDB(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options;
        });
    }
    /**
     * Get Cooldown Array from Antiraid Cache
     * @param {string} id Discord Guild ID
     * @return {Array<Cooldown>}
     */
    getCooldown(id) {
        let cooldown = this.cooldown.get(id);
        if (!cooldown)
            this.cooldown.set(id, []);
        return this.cooldown.get(id);
    }
    /**
     * Save Cooldown Array to Cache
     * @param {string} id Discord Guild ID
     * @param {Array<Cooldown>} cooldownToSave
     * @return {void}
     */
    saveCooldown(id, cooldownToSave) {
        this.cooldown.set(id, cooldownToSave);
    }
    /**
     * Check If member or event is exempted or if member has exempted role
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {string} [event] Event Name
     * @return {boolean}
     * @example
     * let member = message.guild.members.cache.get("id");
     * antiraid.checkExempt(member)
     */
    checkExempt(member, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (member.id === member.guild.ownerID)
                return true;
            const options = yield this.getOptionsFromDB(member.guild.id);
            if (!options || typeof options !== "object")
                throw new Error("Options need to be valid object");
            if (!options.ban && !options.kick && !options.unrank)
                throw new Error("Please provide sanction between ban, kick or unrank (boolean)");
            if (options.exemptMembers.length > 0 || options.exemptRoles.length > 0) {
                options.exemptRoles.forEach(r => {
                    if (member.roles.cache.has(r))
                        return true;
                });
                if (options.exemptMembers.includes(member.id) || (event && options.exemptEvent.includes(event)))
                    return true;
            }
        });
    }
    /**
     * Get Member's cases from cache
     * @param {GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @return {Cooldown} Member's Cases fetched from cache
     */
    search(member, event) {
        return this.getCooldown(member.guild.id).find((c) => c.id === member.id && c.guild === member.guild.id && c.event === event);
    }
}
exports.AntiRaid = AntiRaid;
