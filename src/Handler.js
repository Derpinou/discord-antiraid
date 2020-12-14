const {readdir} = require('fs')
class Handler {
    constructor(client) {
        this.client = client
    }
    load() {
        readdir("./src/events", (err, files) => {
            if (!files) return;
            if (err) this.client.emit("error", err);
            for (const dir of files) {
                readdir(`./src/events/${dir}`, (err, file) => {
                    if (!file) return;
                    if (err) this.client.emit("error", err);
                    for (const evt of file) {
                        try {
                            if (!evt) return;
                            const event = new (require(`./events/${dir}/${evt}`))(this);
                            console.log(`${evt} chargé`);
                            this.client.on(evt.split(".")[0], (...args) => event.run(...args));
                        } catch (e) {
                        }
                    }
                })
            }
        });
        return this
    }
}
module.exports = Handler;