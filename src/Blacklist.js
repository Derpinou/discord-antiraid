const fetch = require('node-fetch')
class BlackList {
    constructor(token) {
        this.token = token;
    }
    async checkBlackList (id) {
        fetch(`https://protect-bot.fr/api/?apiKey=${this.token}&checkblacklist=${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    }
}
module.exports = BlackList