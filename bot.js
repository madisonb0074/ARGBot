const Discord = require('discord.js');
const client = new Discord.Client();
//separate configuration file with prefix
const config = require("./config.json");

client.on('ready', () => {

    console.log('I am ready!');
    
    //Sets bot appearance and game playing in menu
    client.user.setPresence({
    status: 'online',
    game: {name: "use a!help"}
    });
    
    var channel = client.channels.get('581154704785014784');
    channel.sendMessage("I am online.");
    

});

 
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
    
    //outlines everything bot can do
    if (command === 'help') {
        message.channel.send({embed: {
        color: 10826248,
        author: {
          name: "Accurate Realization Gadget",
          icon_url: client.user.avatarURL
        },
        title: "Type \a! followed by any of these commands to use them.",
        description: "The Accurate Realization Gadget is a tool used for utility and fun.
        fields: [{
            name: "Fun:",
            value: "` Nothing here yet. `"
        },
        {
            name: "Utilities:",
            value: "` help ` ` ping `"
        },                
         ],
                             timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
    }
       
         }
         }})
        }

});

 

// Bot token hidden in external variable
client.login(process.env.BOT_TOKEN);
