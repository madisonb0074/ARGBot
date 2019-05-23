const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {

    console.log('I am ready!');

});

 
//'check for this on new message'
client.on('message', message => {
    
//Ignoring messages if not starting with prefix
if (!message.content.startsWith('>') || message.author.bot) return;

    //check if bot is working properly function
    if (message.content === 'ping') {

       message.reply('pong');

       }

});

 

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
