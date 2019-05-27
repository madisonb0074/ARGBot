module.exports = (client, message) => {
//Ignoring all messages BELOW if not starting with prefix
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

//ignores case and makes sure message can be read
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    

});
// grab the command data from Enmap
const cmd = client.commands.get(command);

// if that command doesn't exist, exit and do nothing
if (!cmd) return;

// Run the command
cmd.run(client, message, args);
}
;
