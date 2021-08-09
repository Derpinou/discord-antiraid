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
exports.guildMemberRemove = void 0;
exports.guildMemberRemove = {
    name: "guildMemberRemove",
    run: (client, member) => __awaiter(void 0, void 0, void 0, function* () {
        let exempt = false, check = false;
        const event = "guildMemberRemove", startAt = Date.now();
        try {
            member.guild.fetchAuditLogs({ type: client.actionType["guildMemberRemove"].id, limit: 10 }).then((audit) => audit.entries.first()).then((entry) => __awaiter(void 0, void 0, void 0, function* () {
                if (member.id !== entry.target.id)
                    return undefined;
                const executor = member.guild.members.cache.get(entry.executor.id), caseToCheck = yield client.search(executor, event);
                exempt = yield client.checkExempt(executor, event);
                if (!exempt) {
                    check = yield client.punishable(executor, caseToCheck);
                    if (check) {
                        return client.punish(executor);
                    }
                }
                yield client.addCaseToCooldown(executor, event, caseToCheck, startAt);
            }));
        }
        catch (e) {
            console.error(e);
        }
    })
};
