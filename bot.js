const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  client.user.setPresence({
    status: 'online',
    game: {name: "Use a!help!"}
  });
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	
	//ping command, responds pong when user says a!ping
	if (command === 'ping') {

       	message.reply('pong');

       	}

});

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
