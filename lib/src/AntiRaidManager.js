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
exports.AntiRaidManager = void 0;
const events_1 = require("events");
const discord_js_1 = require("discord.js");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const constants_1 = require("./constants");
const axios_1 = require("axios");
class AntiRaidManager extends events_1.EventEmitter {
    constructor(client, options) {
        var _a, _b;
        super();
        this._client = client;
        this._options = options || constants_1.defaultOptions;
        this.cases = new discord_js_1.Collection();
        this._request = axios_1.default.create({
            baseURL: `${(_a = this._client.options.http) === null || _a === void 0 ? void 0 : _a.api}/v${(_b = this._client.options.http) === null || _b === void 0 ? void 0 : _b.version}`,
            headers: {
                Authorization: `Bot ${this._client.token}`
            }
        });
        this._handleEvents().catch(console.error);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    _handleEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield (0, promises_1.readdir)(`${__dirname}${path_1.sep}events`);
            for (const category of categories) {
                const events = yield (0, promises_1.readdir)(`${__dirname}${path_1.sep}events${path_1.sep}${category}`);
                const js_files = events.filter(f => f.split('.').pop() === 'js');
                for (const event of js_files) {
                    const eventName = event.split('.')[0];
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const evt = require(`${__dirname}${path_1.sep}events${path_1.sep}${category}${path_1.sep}${event}`)['default'];
                    const eventConstructor = new evt(this);
                    //console.log(eventConstructor);
                    this._client.on(eventName, (...args) => eventConstructor.run(...args));
                }
            }
        });
    }
    getOptionsFromDb(id) {
        return this._options;
    }
    addCase(options, user, guild, event, startedAt, oldCase) {
        const cases = this.getCases(guild);
        const caseToPush = {
            guild,
            startedAt,
            user,
            event,
            rate: oldCase && oldCase.rate ? oldCase.rate++ : 1
        };
        cases.push(caseToPush);
        this.cases.set(guild, cases);
        const index = cases.indexOf(caseToPush);
        setTimeout(() => {
            cases.splice(index);
        }, options.time);
        this.cases.set(guild, cases);
    }
    getCases(id) {
        if (!this.cases.get(id)) {
            this.cases.set(id, []);
        }
        return this.cases.get(id);
    }
    search(member, event) {
        return this.getCases(member.guild.id).find(c => c.user === member.id && c.guild === member.guild.id && c.event === event);
    }
    punishable(options, caseToCheck) {
        return caseToCheck && caseToCheck.rate >= options.rateLimit - 1;
    }
    ban(guild, member, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._request.put(`/guilds/${guild}/bans/${member}`, {
                delete_message_days: 0,
                reason
            }, {
                headers: {
                    'X-Audit-Log-Reason': reason
                }
            }).catch((err) => {
                this.emit('error', err);
            });
        });
    }
    kick(guild, member, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._request.delete(`/guilds/${guild}/members/${member}`, {
                headers: {
                    'X-Audit-Log-Reason': reason
                }
            }).catch((err) => {
                this.emit('error', err);
            });
        });
    }
    removeRoles(guild, member, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._request.patch(`/guilds/${guild}/members/${member}`, {
                roles: []
            }, {
                headers: {
                    'X-Audit-Log-Reason': reason
                }
            }).catch((err) => {
                this.emit('error', err);
            });
        });
    }
}
exports.AntiRaidManager = AntiRaidManager;
