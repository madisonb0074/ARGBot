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
	//if the message sender is a bot, ignore it to prevent feedback loop
	if (message.author.bot) return;
  	if (message.content.indexOf(config.prefix) !== 0) return;

  	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();

	//ping command, responds pong when user says a!ping
	if (command === 'ping') {

       	message.channel.send('pong');

       	}

});

//audit log for bot, first sends message when
client.on('messageDelete', async (message) => {
  //Creating a log channel within a server if has the permissions
  const logs = message.guild.channels.find(channel => channel.name === "accuratebotlog");
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('accuratebotlog', 'text');
  }
  //If doesn't have the permissions, complain about it in console console.log();
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  const channel = messageDelete.guild.channels.find(ch => ch.name === 'accuratebotlog');channel.send(`The message : "${messageDelete.content}" by ${messageDelete.author} was deleted. Their ID is ${messageDelete.author.id}`)});
})


// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
