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
  const logs = message.guild.channels.find(channel => channel.name === "accuratebotlog");
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('accuratebotlog', 'text');
  }
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first())
  let user = ""
    if (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)) {
    user = entry.executor.username
  } else {
    user = message.author.username
  }
  accuratebotlog.sendMessage(`A message was deleted in ${message.channel.name} by ${user}`);
})


// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
