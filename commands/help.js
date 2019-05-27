exports.run = (client, message, args) => {
    message.channel.send({
        embed: {
            color: 10826248,
            author: {
                name: "Accurate Realization Gadget",
                icon_url: client.user.avatarURL
            },
            title: "Type \a! followed by any of these commands to use them.",
            description: "The Accurate Realization Gadget is a tool used for utility and fun.",
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
    }).catch(console.error);
};
