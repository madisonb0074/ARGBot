const Discord = require('discord.js');
const client = new Discord.Client();
//separate configuration file with prefix
const config = require("./config.json");

client.on('ready', () => {

    console.log('I am ready!');

});


let defaultChannel = "";
guild.channels.forEach((channel) => {
  if(channel.type == "text" && defaultChannel == "") {
    if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
      defaultChannel = channel;
    }
  }
})

defaultChannel.send(`Hello. I am the Accurate Realization Gadget. Here are my current commands.`, {
embed:{
    title: 'Help menu.',
    color: 10826248, 
    description: "The prefix for all my commands is \'a!\', e.g: \'a!help\'.",
    fields:[
        {
            name: 'Fun',
            value: 'Nothing yet.'
        },     
        {
            name: 'Utilities',
            value: 'help, ping'
        }
    ],

    footer: {
        text: 'ARGBot created and developed by radcircles'
    }
}

 
//'check for this on new message'
client.on('message', message => {
    
//Ignoring all messages BELOW if not starting with prefix
if (!message.content.startsWith(config.prefix) || message.author.bot) return;

//ignores case and makes sure message can be read
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

    //check if bot is working properly function
    if (command === 'ping') {

       message.reply('pong');

       }

});

 

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
