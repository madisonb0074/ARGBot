//response command, ping = filename, thus it recognizes ping as the command and responds.

exports.run = (client, message, args) => {
    message.channel.send("pong!").catch(console.error);
}
