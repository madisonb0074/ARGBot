// requiring discord bot framework and login, as well as external bot file with login token
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const CHANNEL = config.channel

// **SIMPLE EVENT HANDLERS*

// Sends message upon server join, outlining very important info such as how to see bot log
client.on('guildCreate', guild => {
  let defaultChannel = ''
  // checks each channel in the server and finds the first one it can send messages in text to
  guild.channels.forEach((channel) => {
    if (channel.type === 'text' && defaultChannel === '') {
      if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
        defaultChannel = channel
      }
    }
  })
  // message sent to the first channel found explaining why we need a log channel
  // (this log channel appears mostly innocent and boring as a function, but is a roundabout way for making the bot changes visible to all users, allowing for full transparency of ARGbot's more extensive actions, and acts as a recognition of when things are done by the bot)!
  defaultChannel.send('Hello, I am the Accurate Realization Gadget. Before we start, there are a few important things I need to outline! Since one of my main functions is as an auditlog bot with more detailed info than the original Discord bot log, I *need* a channel made for me called #accuratebotlog if the audit log function is to be used, otherwise this main function is unavailable as I cannot create this channel for myself in all servers. Thank you!')
})

// when bot is ready to go, send a message to the test server (NOT all servers)
client.on('ready', () => {
  // this number within the client.channels.get is the ARGTEST server bot-log channel ID specifically
  var channel = client.channels.get('581154704785014784')
  channel.send('I am online, ready to create chaos.')

  // shows that the bot is online, and what command to use in the bot appearance within servers
  client.user.setPresence({
    status: 'online',
    game: {
      name: 'Use a!help!'
    }
  })
})

// event fired when message is sent to server, put all commands used with a prefix within if/else here
client.on('message', message => {
  // if the message sender is a bot, ignore it to prevent feedback loop
  if (message.author.bot) return
  // if message does not have prefix, completely ignore it, effectively only paying attention to commands
  if (message.content.indexOf(config.prefix) !== 0) return
  // allows code to use if(command === 'whatever') rather than typing out if message.contains etc & allows commands to work if uppercase (args is arguments, or number thereof)
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  switch (command) {
    // simplest command, responds pong when user says ping w/ prefix
    case 'ping':
      message.channel.send('Pong!')
      break
      // 8 ball command, sends 8 ball answer when user asks
    case '8ball':
      var eightBallResponses = [
        'It is certain.',
        'It is decidedly so.',
        'Without a doubt.',
        'Yes - definitely.',
        'You may rely on it.',
        'As I see it, yes.',
        'Most likely.',
        'Outlook good.',
        'Yes.',
        'Signs point to yes.',
        'Reply hazy, try again.',
        'Ask again later.',
        'Better not tell you now.',
        'Cannot predict now.',
        'Concentrate and ask again.',
        'Don\'t count on it.',
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Very doubtful.',
        'A buzzing gold beast with an electrical Pavlov\'s bell overlooking opens his mouth as if to speak his mind, then shakes his head.'
      ]
      var randomAnswer = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)]
      message.channel.send(randomAnswer)
      break
      // help command, outlines all the commands along with important information within an embed
      // if there are extra args (words within a command) that connect with a command, elaborate on the command
      // otherwise just send the general help page
    case 'help':
    // find arguments that come after the first word
      if (args.length > 0) {
        if (args[0] === '8ball') {
          help('8ball', 'a!8ball + yes/no question', 'An 8ball bot used to answer simple yes/no questions.')
        }
      } else {
        // main help function occurring if there are no extra arguments
        message.channel.send({
          embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: 'Accurate Rationalization Gadget Bot Help',
            description: 'This is a collection of all commands, use a!your_command (replacing your_command with the command) to use them.',
            fields: [{
              name: 'Fun commands',
              value: '` 8ball `, ` ping `'
            },
            {
              name: 'Logging commands',
              value: '` Currently empty `'
            },
            {
              name: 'Functional commands',
              value: '` help `'
            }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: 'ARGBOT'
            }
          }
        })
      }
  }

  function help (title, usage, description) {
    message.channel.send({
      embed: {
        color: 15285149,
        title: 'Command: ' + title,
        fields: [{
          name: 'Usage: ',
          value: usage
        },
        {
          name: 'Description: ',
          value: description
        }
        ]
      }
    })
  }
})

// **AUDIT LOG EVENT HANDLERS**

// sends message when anything is deleted
client.on('messageDelete', function (message) {
  if (message.channel.type === 'text') {
    // post in the server's log channel, by finding the accuratebotlog channel (SERVER ADMINS **MUST** CREATE THIS CHANNEL ON THEIR OWN, IF THEY WANT A LOG)
    var log = message.guild.channels.find('name', CHANNEL)
    if (log != null) {
      log.send('**Message Deleted** ' + message.author.username + '\'s message: ' + message.cleanContent + ' has been deleted.')
    }
  }
})

// event handler that sends message when important (externally editable) user statuses change (for example nickname)
client.on('guildMemberUpdate', function (oldMember, newMember) {
  const guild = newMember.guild
  // declare changes
  var Changes = {
    unknown: 0,
    addedRole: 1,
    removedRole: 2,
    username: 3,
    nickname: 4,
    avatar: 5
  }
  // currently, before any changes, it is seen as unknown
  var change = Changes.unknown

  // check if roles were removed
  var removedRole = ''
  oldMember.roles.every(function (value) {
    if (newMember.roles.find('id', value.id) == null) {
      change = Changes.removedRole
      removedRole = value.name
    }
  })

  // check if roles were added
  var addedRole = ''
  newMember.roles.every(function (value) {
    if (oldMember.roles.find('id', value.id) == null) {
      change = Changes.addedRole
      addedRole = value.name
    }
  })

  // check if username changed
  if (newMember.user.username !== oldMember.user.username) {
    change = Changes.username
  }
  // check if nickname changed
  if (newMember.nickname !== oldMember.nickname) {
    change = Changes.nickname
  }
  // check if avatar changed
  if (newMember.user.avatarURL !== oldMember.user.avatarURL) {
    change = Changes.avatar
  }
  // send message in the guild's log channel
  var log = guild.channels.find('name', CHANNEL)
  // if log exists, send message depending on the specific case
  if (log != null) {
    switch (change) {
      case Changes.unknown:
        log.send('**User Update** ' + newMember.user.username)
        break
      case Changes.addedRole:
        log.send('**User Role Added** ' + newMember.user.username + ': ' + addedRole)
        break
      case Changes.removedRole:
        log.send('**User Role Removed** ' + newMember.user.username + ': ' + removedRole)
        break
      case Changes.username:
        log.send('**User Username Changed** ' + newMember.user.username + ': Username changed from ' +
          oldMember.user.username + '#' + oldMember.user.discriminator + ' to ' +
          newMember.user.username + '#' + newMember.user.discriminator)
        break
      case Changes.nickname:
        log.send('**User Nickname Changed** ' + newMember.user.username + ': ' +
          (oldMember.nickname != null ? 'Changed nickname from ' + oldMember.nickname +
            +newMember.nickname : 'Set nickname') + ' to ' +
          (newMember.nickname != null ? newMember.nickname + '.' : 'original username.'))
        break
      case Changes.avatar:
        log.send('**User Avatar Changed** ' + newMember.user.username)
        break
    }
  }
})

// Bot login token hidden in external variable within heroku. DO NOT PUT IN THIS FILE EVER!!!!!!!!!
client.login(process.env.BOT_TOKEN)
