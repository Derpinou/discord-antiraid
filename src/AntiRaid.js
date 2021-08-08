const
    Discord = require('discord.js'),
    {EventEmitter} = require('events'),
    {readdirSync} = require('fs'),
    {
        AUDIT_LOG,
        AntiRaidOptions,
        defaultAntiRaidOptions,
        Cooldown
    } = require('./Constants'),
    {sep} = require('path');
/**
 * AntiRaid
 */
class AntiRaid extends EventEmitter {
    /**
     * @param {Discord.Client} client The Discord Client
     * @param {AntiRaidOptions} options The Antiraid options
     */
    constructor(client, options) {
        super();
        if (!client) throw new Error('Client is a required option.');
        /**
         * The Discord Client
         * @type {Discord.Client}
         */
        this.client = client;
        /**
         * The Antiraid options
         * @type {AntiRaidOptions}
         */
        this.options = options || defaultAntiRaidOptions;
        /**
         * The Antiraid cooldown
         * @type {Discord.Collection}
         */
        this.cooldown = new Discord.Collection();
        /**
         * The Discord Audit Logs Action Type
         * @type {AUDIT_LOG}
         */
        this.actionType = AUDIT_LOG;
        this.init();
    }

    /**
     * Load Events Files and Add Events Listeners
     * @ignore
     * @private
     */
    init() {
        readdirSync(`${__dirname}${sep}events${sep}`).forEach((dir) => {
            if (dir[0] !== ".") {
                readdirSync(`${__dirname}${sep}events${sep}${dir}`)
                    .filter((f) => f.endsWith(".js"))
                    .forEach((f, i) => {
                        try {
                            const event = new (require(`./events/${dir}/${f}`))(this);
                            this.client.on(event.constructor.name, (...args) => event.run(...args));
                        } catch (error) {
                            console.log(error);
                        }
                    });
            }
        });
    }

    /**
     * Add Case to Cooldown
     * @param {Discord.GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @param {Cooldown} obje Old Cooldown
     * @param {number} startAt Timestamp of Event
     */
    async addCase (member, event, obje, startAt) {
        const options = await this.getOptionsFromDB(member.guild.id);
        if (!options || typeof options !== "object") throw new Error("Options need to be valid object");
        const cooldown = this.getCooldown(member.guild.id);
        cooldown.push({
            id: member.id,
            guild: member.guild.id,
            event: event,
            startedAt: startAt,
            rate: obje ? obje.rate++ : 1
        })
        this.saveCooldown(member.guild.id, cooldown);
        let index = cooldown.indexOf({
            id: member.id,
            startedAt: startAt
        });
        setTimeout(async () => {
            cooldown.splice(index);
        }, options.time || 10000)
        this.saveCooldown(member.guild.id, cooldown);
    }

    /**
     * Check if member is eligible to sanction
     * @param {Discord.GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @param {Cooldown} obje Cooldown
     * @return {boolean} Member is eligible to sanction
     */
    async checkCase (member, event, obje) {
        const options = await this.getOptionsFromDB(member.guild.id);
        if (!options || typeof options !== "object") throw new Error("Options need to be valid object");
        if (!options || !options.rateLimit) throw new Error("Cannot found options.rateLimit");
        return obje && obje.rate >= options.rateLimit -1;
    }

    /**
     * Ban/Kick/Unrank Member
     * @param {Discord.GuildMember} member Discord GuildMember resolvable
     *
     * @example
     * antiraid.punish(Member)
     */
    async punish(member) {
        const options = await this.getOptionsFromDB(member.guild.id);
        if (!options || typeof options !== "object") throw new Error("Options need to be valid object");
        if (!options.ban && !options.kick && !options.unrank) throw new Error("Please provide sanction between ban, kick or unrank (boolean)");
        if (options.ban) {
            return member.ban({reason: options.reason});
        } else if (options.kick) {
            return member.kick(options.reason);
        }
        if (options.unrank) {
            member.roles.cache.forEach(role => {
                member.roles.remove(role).catch(e => null);
            })
        }
        this.emit("punish", member, options.reason, options.ban ? "ban" : options.kick ? "kick" : options.unrank ? "unrank" : false);
    }

    /**
     * Get Guild Options from DB
     * @param {string} id Discord Guild ID
     * @return {AntiRaidOptions} AntiRaid Options get from DB
     */
    async getOptionsFromDB (id) {
        return this.options;
    }

    /**
     * Get Cooldown Array from Cache
     * @param {string} id Discord Guild ID
     * @return {Array<Cooldown>}
     */
    getCooldown (id) {
        let cooldown = this.cooldown.get(id);
        if (!cooldown) this.cooldown.set(id, []);
        cooldown = this.cooldown.get(id);
        return cooldown
    }

    /**
     * Save Cooldown Array to Cache
     * @param {string} id Discord Guild ID
     * @param {Array<Cooldown>} cooldownToSave
     */
    saveCooldown (id, cooldownToSave) {
        this.cooldown.set(id, cooldownToSave);
    }

    /**
     * Check If member or event is exempted or if member has exempted role
     * @param {Discord.GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @return boolean
     */
    async checkExempt (member, event) {
        const options = await this.getOptionsFromDB(member.guild.id);
        if (!options || typeof options !== "object") throw new Error("Options need to be valid object");
        if (!options.ban && !options.kick && !options.unrank) throw new Error("Please provide sanction between ban, kick or unrank (boolean)");
        if (options.exemptMembers.length > 0 || options.exemptRoles.length > 0) {
            options.exemptRoles.forEach(r => {
                if (member.roles.cache.has(r)) return true;
            })
            if (options.exemptMembers.includes(member.id) || options.exemptEvent.includes(event)) return true
        }
    }

    /**
     * Get Member's cases from cache
     * @param {Discord.GuildMember} member Discord GuildMember resolvable
     * @param {string} event Event Name
     * @return {Cooldown} Member's Cases geted from cache
     */
    search(member, event) {
        return this.getCooldown(member.guild.id).find(c => c.id === member.id && c.guild === member.guild.id && c.event === event);
    }
}
/**
 * Emitted when a member got punished.
 * @event AntiRaid#punish
 * @param {Discord.GuildMember} member Discord GuildMember resolvable
 * @param {AntiRaidOptions.reason} reason Punishment reason
 * @param {string} sanction Sanction type (ban|kick|unrank)
 * @example
 * // Print args in Console
 *   antiraid.on("punish", (member, reason, sanction) => {
 *       member.guild.channels.cache.get("848500695506223107").send(`${member.user.username} got banned for raid attempt`)
 *   })
 *

 */
module.exports = AntiRaid;