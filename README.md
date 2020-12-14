# discord-antiraid
Npm for protect server for Raid attacks

Supported Events:
```js
 channelCreate
 channelDelete
 
 emojiCreate
 emojiDelete
 
 roleCreate
 roleDelete
 
 webHookUpdate
 
 guildBanAdd
```

List of AntiRaid Methods:
```js
const {AntiRaid} = require('discord-antiraid');
(async ()=> {
    let antiRaid = new AntiRaid(client, {
        rateLimit: 3,
        time: 10000, 
        ban: false,
        kick: true,
        exemptMembers: [],
        exemptRoles: [],
        exemptEvent: []
    })
    let member = client.guilds.cache.get("").members.cache.get(""),
    event = "guildBanAdd";
    
    
    
    let obj = await antiRaid.search(member, event)
    console.log(obj)
    /*
    Output:
    {
      id: 'XXXXXXXXXXXXXXXXXX',
      guild: 'XXXXXXXXXXXXXXXXXX',
      event: 'guildBanAdd',
      startedAt: XXXXXXXXXXXXX,
      rate: 1
    }
    */
    await antiRaid.addCase(member, event, obj, Date.now())
    
    await antiRaid.punish(member)
    
    await antiRaid.checkExempt(member)
    
    await antiRaid.checkCase(member, event, obj)
})
```
AntiInvite
```js
const {AntiInvite} = require('discord-antiraid');


(async () => {   
    let antiInvite = new AntiInvite(client, {
        invalid: true,                                             
        rateLimit: 3,                                            
        time: 10000,                                             
        ban: false,                                             
        kick: true,                                       
        exemptMembers: [],
        exemptRoles: []
    })
    let member = client.guilds.cache.get("").members.cache.get("");
    
    
    
    let obj = await antiInvite.search(member)
    console.log(obj)
    /*
    Output:
    {
      id: 'XXXXXXXXXXXXXXXXXX',
      guild: 'XXXXXXXXXXXXXXXXXX',
      startedAt: XXXXXXXXXXXXX,
      rate: 1
    }
    */
    await antiInvite.addCase(member, obj, Date.now())
    
    await antiInvite.punish(member)
    
    await antiInvite.checkExempt(member)
    
    await antiInvite.checkCase(member, event, obj)

})
```
Check Blacklist Protect-Bot API (don't working)
```js
const {Blacklist} = require('discord-antiraid');

(async () => {
    //Check here for get Api TOKEN: http://protect-bot.fr/membre/index.php?p=api
    let blacklist = new Blacklist("token")
    let check = await blacklist.checkBlackList("id");
    console.log(check)
    /*
    Output:
    {
      id: 'XXXXXXXXXXXXXXXXXX',
      blacklist: true/false,
      blacklister: XXXXXXXXXXXXX,
      raison: "Selfbot",
      "date":"XXXXXXXXXX"
    }
    */
})
```