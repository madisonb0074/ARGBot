const Discord = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client();

//separate configuration file with prefix
const config = require("./config.json");

//making the config file useable anywhere and with all commands
client.config = config;

//code used to separate commands into new files/allow commands to be edited without resetting the bot
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        //loading event files separate from main
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        // if the file is not a JS file, ignore it
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.on('ready', () => {
    //notification for the CONSOLE when the bot starts up
    console.log('I am ready!');

    //Sets bot appearance and game playing on Discord
    client.user.setPresence({
        status: 'online',
        game: {name: "use a!help"}
    });
    //notification for bot TEST SERVER when bot starts up
    var channel = client.channels.get('581154704785014784');
    channel.sendMessage("I am online.");


});






// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
