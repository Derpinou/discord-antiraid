<div align="center">

<a href="https://npmjs.com/discord-antiraid">
  <img width="50%"src="https://cdn.discordapp.com/attachments/730165562189152407/870362597441011732/DAR_Banner.png" />
</a>

Discord.js extention library for protect discord servers against Raids

[![downloadsBadge](https://img.shields.io/npm/dt/discord-antiraid?style=for-the-badge)](https://npmjs.com/discord-antiraid)
[![versionBadge](https://img.shields.io/npm/v/discord-antiraid?style=for-the-badge)](https://npmjs.com/discord-antiraid)

<br>

[![discord](https://discord.com/api/guilds/848500695506223104/widget.png)](https://discord.gg/ahjFrbk2Nr)
[![GitHub license](https://img.shields.io/github/license/Derpinou/discord-antiraid.svg)](https://github.com/Derpinou/discord-antiraid/blob/master/LICENSE)

</div>

## - Installation:
```

npm i discord-antiraid

```


Supported Events:
(If you want to Add your Own Events, Use AntiRaid Class Methods in the documentation or follow Example [here](https://github.com/Derpinou/discord-antiraid/blob/main/example/AntiRaid/Event.js))

```js
    channelCreate
    channelDelete
 
    roleCreate
    roleDelete
 
    guildBanAdd
    guildBanRemove
    guildMemberRemove

    threadCreate
    threadDelete

```

Create AntiRaid:
(Example: [here](https://github.com/Derpinou/discord-antiraid/blob/main/example/AntiRaid/sample.js))

```js
const {AntiRaidManager} = require('discord-antiraid');

const antiraid = new AntiRaidManager(client, {
    enabled: true,
    events: [
        "channelCreate",
        "channelDelete",
        "roleCreate",
        "roleDelete",
        "threadCreate",
        "threadDelete",
    ],
    exemptedRoles: [], // Ignored roles (ex: ['848500766955405332'])
    exemptedUsers: [], // Ignored users (ex: ['555429540613062656'])
    rateLimit: 2, // Number of events before sanction
    time: 30000, // Time in ms before case deletion
    sanction: 'removeAllRoles', // Sanction to apply (ex: 'removeAllRoles' / 'ban' / 'kick')
    reason: 'discord-antiraid' // Audit Log Reason
})
```
Using Database (Example with [quick.db](https://www.npmjs.com/package/quick.db)):

## - Changelog:

See Changelog [here](https://github.com/Derpinou/discord-antiraid/blob/main/CHANGELOG.md)


## - Contributors:
<a href="https://github.com/Derpinou/discord-antiraid/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Derpinou/discord-antiraid" />
</a>

## - Special Credits:
Thanks to [Androz](https://github.com/Androz2091) with his repo [discord-giveaways](https://github.com/Androz2091/discord-giveaways) for doc generator and typing example

Thanks to [Sayrix](https://github.com/Sayrix) for making the logo and the banner

## - License:

Licensed under the MIT license.