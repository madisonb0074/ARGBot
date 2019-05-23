const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {

    console.log('I am ready!');

});

 
//'check for this on new message'
client.on('message', message => {
    
//Ignoring all messages BELOW if not starting with prefix
if (!message.content.startsWith(prefix) || message.author.bot) return;

//ignores case and makes sure message can be read
const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

    //check if bot is working properly function
    if (command === 'ping') {

       message.reply('pong');

       }

});

 

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
