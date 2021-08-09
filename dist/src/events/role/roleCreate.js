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
exports.roleCreate = void 0;
exports.roleCreate = {
    name: "roleCreate",
    run: (client, role) => __awaiter(void 0, void 0, void 0, function* () {
        let exempt = false, check = false;
        const event = "roleCreate", startAt = Date.now();
        try {
            role.guild.fetchAuditLogs({ type: client.actionType["roleCreate"].id, limit: 10 }).then((audit) => audit.entries.first()).then((entry) => __awaiter(void 0, void 0, void 0, function* () {
                if (role.id !== entry.target.id)
                    return undefined;
                const member = role.guild.members.cache.get(entry.executor.id), caseToCheck = yield client.search(member, event);
                exempt = yield client.checkExempt(member, event);
                if (!exempt) {
                    check = yield client.punishable(member, caseToCheck);
                    if (check) {
                        return client.punish(member);
                    }
                }
                yield client.addCaseToCooldown(member, event, caseToCheck, startAt);
            }));
        }
        catch (e) {
            console.error(e);
        }
    })
};
