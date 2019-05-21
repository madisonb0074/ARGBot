const Discord = require('discord.js');
const client = new Discord.Client();

char prefix = ">";

client.on('ready', () => {

    console.log('I am ready!');

});

//Ignoring messages if not starting with prefix
if (!message.content.startsWith(prefix) || message.author.bot) return; 

client.on('message', message => {

    if (message.content === 'ping') {

       message.reply('pong');

       }

});

 

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
