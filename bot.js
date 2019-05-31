const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {

var channel = client.channels.get('581154704785014784');
channel.sendMessage("I am online.");

  client.user.setPresence({
    status: 'online',
    game: {name: "Use a!help!"}
  });
});

client.on('message', message => {
	if (message.author.bot) return;
 	// This is where we'll put our code.
  	if (message.content.indexOf(config.prefix) !== 0) return;

  	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();

	//ping command, responds pong when user says a!ping
	if (command === 'ping') {

       	message.channel.send('pong');

	}

});

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
