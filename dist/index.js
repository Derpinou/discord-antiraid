"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.AntiRaid = void 0;
var Antiraid_1 = require("./src/Antiraid");
Object.defineProperty(exports, "AntiRaid", { enumerable: true, get: function () { return Antiraid_1.AntiRaid; } });
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.version = require(`${__dirname}/../package.json`).version;
