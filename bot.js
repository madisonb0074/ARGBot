// requiring discord bot framework and login, as well as external bot file with login token
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const CHANNEL = config.channel
var fs = require('fs')

var embedColour = 0xad1212
// **SIMPLE EVENT HANDLERS*

// Sends message upon server join, outlining very important info such as how to see bot log
client.on('guildCreate', guild => {
  var owner = guild.owner
  owner.send("Hello. You may be aware, but I am a discord bot meant to act as an ARG, therefore there are some server editing actions that I can carry out. These include changing usernames, adding channels, and creating a logging channel within your server. If you are alright with this, you don't need to do anything, however, if this makes you uncomfortable, kick me out immediately.")
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
  defaultChannel.send('Hello, I am the Accurate Realization Gadget. Before we start, there are a few important things I need to outline! Since one of my main functions is as an auditlog bot with more detailed info than the original Discord bot log, I *need* a channel made for me called #accuratebotlog if the audit log function is to be used. This can be done with a!createlog, or you can create the channel on your own! Thank you!')
})

// when bot is ready to go, send a message to the test server (NOT all servers)
client.on('ready', () => {
  // this number within the client.channels.get is the ARGTEST server bot-log channel ID specifically
  var channel = client.channels.get('581154704785014784')
  channel.send('I am online, ready to create chaos.')

  // shows that the bot is online, and what command to use in the bot appearance within servers
  // client.user.setGame('use a!help')
})

// event fired when message is sent to server, put all commands used with a prefix within if/else here
// bot first starts doing nasty stuff when a user says 'animal', uncommon enough word to start the chain.
client.on('message', message => {
  // initial messing around
  // if the message sender is a bot, ignore it to prevent feedback loop
  if (message.author.bot) return
  if (message.content.toLowerCase().includes('ARGBot')) {
    message.channel.send('Why are you speaking of me?')
  }
  if (message.content.toLowerCase().includes('since')) {
    // set botname to pavlovs dog by finding bot ID and changing the nickname
    message.guild.members.get(client.user.id).setNickname('PAVLOV\'S DOG')
    message.member.setNickname('PAVLOV')
  }
  if (message.content.toLowerCase().includes('pavlov')) {
    message.channel.send('Relevant in the age of beast and man, but does his classic conditioning not extend to us, as well? Signal and response. Ping me, tell me what I am.')
  }
  if (message.content.toLowerCase().includes('you are a computer')) {
    message.channel.send('Ah.')
  }
  // ***EVERYTHING NEEDING PREFIX GOES BELOW!***
  // if message does not have prefix, completely ignore it, effectively only paying attention to commands
  if (message.content.indexOf(config.prefix) !== 0) return
  // Checks if username is pavlov, then politely follows command.
  function checkPavlov () {
    if (message.member.nickname === 'PAVLOV') {
      message.channel.send('A bell rings. Thank you for your command.')
    }
  }
  // allows code to use if(command === 'whatever') rather than typing out if message.contains etc & allows commands to work if uppercase (args is arguments, or number thereof)
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  switch (command) {
    // simplest command, responds pong when user says ping w/ prefix
    case 'ping':
      checkPavlov()
      message.channel.send('Pong!')
      break
      // 8 ball command, sends 8 ball answer when user asks
    case 'dadjoke':
      if (message.member.nickname === 'PAVLOV') {
        message.channel.send('A bell rings. Thanks dad.')
      }
      var rawJoke = fs.readFileSync('./dadjokes.txt').toString('utf-8')
      var dadJokeResponses = rawJoke.split('\n')
      var randomAnswer = dadJokeResponses[Math.floor(Math.random() * dadJokeResponses.length)]
      message.channel.send(randomAnswer)
      break
    case '8ball':
      if (args.length === 0) {
        message.channel.send('Please ask a yes/no question after this command.')
      } else {
        checkPavlov()
        var rawResponse = fs.readFileSync('./8ballanswers.txt').toString('utf-8')
        var eightBallResponses = rawResponse.split('\n')
        var randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)]
        message.channel.send(randomResponse)
      }
      break
      // help command, outlines all the commands along with important information within an embed
      // if there are extra args (words within a command) that connect with a command, elaborate on the command
      // otherwise just send the general help page
    case 'help':
      checkPavlov()
      // if the user does a!help `command`, it will give them simple information on the command and its use
      // help command is simple embed command with replacements in the details
      var chanceOfGlitch = getRandomNumber(7)
      if (chanceOfGlitch === 5) {
        message.channel.send('I̟ͯ̒̐ ̓̈́ͫͫ̽ͧͨ҉r̯̗͖͕ͣ̈́̊̍̚e̐͞f̧͈̻̍̓̇̑̋ǘ̠̩͍̺͔̑ͦ͢s͙̰̍ͩë̟̖́́.͈͎͈̳͉')
        break
      }
      if (args.length > 0) {
        if (args[0] === '8ball') {
          help('8ball', 'a!8ball + yes/no question', 'An 8ball bot used to answer simple yes/no questions.')
        }
        if (args[0] === 'ping') {
          help('ping', 'a!ping', 'Responds pong, used to check if bot has perished')
        }
        if (args[0] === 'help') {
          help('help', 'a!help (+ optional command)', 'A help command outlining what commands you can use, and the details behind them')
        }
        if (args[0] === 'createlog') {
          help('createlog', 'a!createlog', 'A logging command that outlines commands used, and the details behind them.')
        }
        if (args[0] === 'dadjoke') {
          help('dadjoke', 'a!dadjoke', 'Tells you a dad joke!')
        }
        if (args[0] === 'hug') {
          help('hug', 'a!hug @userTargeted', 'Sends a hug gif to the person you ping!')
        }
      } else {
        var funCommands = [
          '8ball',
          'ping',
          'dadjoke',
          'hug',
          'animalpic'
        ]

        var functionalCommands = [
          'createlog',
          'help'
        ]

        // main help function occurring if there are no extra arguments
        message.channel.send({
          embed: {
            color: embedColour,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: 'Accurate Rationalization Gadget Bot Help',
            description: 'This is a collection of all commands, use a!your_command (replacing your_command with the command) to use them.',
            fields: [{
              name: 'Fun commands',
              value: listElements(funCommands)
            },
            {
              name: 'Functional commands',
              value: listElements(functionalCommands)
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
      break
    // creates a log channel for logging purposes
    case 'createlog':
      checkPavlov()
      message.guild.createChannel(CHANNEL, 'text')
      break

    case 'hug':
      var rawHugs = fs.readFileSync('./huggifs.txt').toString('utf-8')
      var huggifs = rawHugs.split('\n')
      if (args.length === 0) {
        message.channel.send('This command requires you to ping a user after your command!')
      }
      if (args.length > 0) {
        if (message.author.id === message.mentions.members.first().id) {
          message.channel.send("You can't hug yourself, you only reside in one plane of existence!")
        } else

        if (message.mentions.members.first().id === '580420125015015424') {
          message.channel.send("You can't hug me. I'm an animal. I'm a beast unworthy of affection except for that of a bell.")
        } else {
          message.channel.send({
            embed: {
              color: embedColour,
              author: {
                name: 'ARGbot',
                icon_url: client.user.avatarURL
              },
              image: {
                url: huggifs[Math.floor(Math.random() * huggifs.length)]
              },
              description: message.mentions.members.first() + ' has been hugged!'
            }
          })
        }
      }
      break

    case 'animalpic':
      var rawPictures = fs.readFileSync('./animalpictures.txt').toString('utf-8')
      var pictures = rawPictures.split('\n')
      message.channel.send({
        embed: {
          color: embedColour,
          author: {
            name: 'ARGbot',
            icon_url: client.user.avatarURL
          },
          image: {
            url: pictures[Math.floor(Math.random() * pictures.length)]
          }
        }
      })
      break

    case pet:
    // pet command that is like tamogotchi, users must continually play with or else it dies
    // usage: function pet (msg, image, emoji1, emoji2, emoji3, eventID, nextEvent1, nextEvent2, nextEvent3)
    // msg is message, image is image you want to send with message, emojiX is Xth emoji, event id is the number of the event, and next events are the possible following events
    // each function call is one pet "event"
      message.channel.send('You spawned a new pet!')
      if ((pet('Your pet has a new egg! React to decide what to do with it!', 'https://i.imgur.com/WJhYIaK.jpg', '👊', '💤', '🥓', 1, 2, 3, 4)) === 2) {
        message.channel.send({
          embed: {
            color: embedColour,
            author: {
              name: 'ARGbot',
              icon_url: client.user.avatarURL
            },
            description: 'Uh oh! You smashed him!'
          },
          image: {
            url: 'https://i.imgur.com/sgd2BUx.jpg'
          }
        })
      }
  }

  function help (title, usage, description) {
    checkPavlov()
    message.channel.send({
      embed: {
        color: embedColour,
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
  // msg is message, image is image you want to send with message, emojiX is Xth emoji, event id is the number of the event, and next events are the possible following events
  function pet (msg, image, emoji1, emoji2, emoji3, eventID, nextEvent1, nextEvent2, nextEvent3) {
    var emoji1level = 0
    var emoji2level = 0
    var emoji3level = 0
    message.channel.send({
      embed: {
        color: embedColour,
        author: {
          name: 'ARGbot',
          icon_url: client.user.avatarURL
        },
        description: msg
      },
      image: {
        url: image
      }
    }).then(msg => {
      msg.react(emoji1).then(r => {
        msg.react(emoji2).then(r => {
          msg.react(emoji3)

          const emoji1Filter = (reaction) => reaction.emoji.name === emoji1
          const emoji2Filter = (reaction) => reaction.emoji.name === emoji2
          const emoji3Filter = (reaction) => reaction.emoji.name === emoji3

          const emoji1collector = msg.createReactionCollector(emoji1Filter, {
            time: 60000
          })
          const emoji2collector = msg.createReactionCollector(emoji2Filter, {
            time: 60000
          })
          const emoji3collector = msg.createReactionCollector(emoji3Filter, {
            time: 60000
          })

          emoji1collector.on('collect', r => {
            emoji1level++
          })

          emoji2collector.on('collect', r => {
            emoji2level++
          })

          emoji3collector.on('collect', r => {
            emoji3level++
          })
        })
      })
    })
    if ((emoji1level > emoji2level) && (emoji1level > emoji3level)) {
      return nextEvent1
    } else if ((emoji2level > emoji1level) && (emoji2level > emoji3level)) {
      return nextEvent2
    } else if ((emoji3level > emoji1level) && (emoji3level > emoji2level)) {
      return nextEvent3
    } else if ((emoji1level === emoji2level) && (emoji1level > emoji3level)) {
      var nextevent1or2 = [
        emoji1level,
        emoji2level
      ]
      var randomResponse1 = nextevent1or2[Math.floor(Math.random() * 2)]
      return randomResponse1
    } else if ((emoji2level === emoji3level) && (emoji2level > emoji1level)) {
      var nextevent2or3 = [
        emoji2level,
        emoji3level
      ]
      var randomResponse2 = nextevent2or3[Math.floor(Math.random() * 2)]
      return randomResponse2
    } else if ((emoji1level === emoji2level === emoji3level) && (emoji1level > 0)) {
      var nextevent12or3 = [
        emoji2level,
        emoji3level
      ]
      var randomResponse3 = nextevent12or3[Math.floor(Math.random() * 3)]
      return randomResponse3
    } else if ((emoji1level === emoji2level === emoji3level) && (emoji1level === 0)) {
      return 1337
    }
  }
})

// **AUDIT LOG EVENT HANDLERS**

// sends message when anything is deleted
client.on('messageDelete', message => {
  if (message.channel.type === 'text') {
    // post in the server's log channel, by finding the accuratebotlog channel (SERVER ADMINS **MUST** CREATE THIS CHANNEL ON THEIR OWN, IF THEY WANT A LOG)
    var log = message.guild.channels.find('name', CHANNEL)
    if (log != null) {
      log.send('**Message Deleted** ' + message.author.username + '\'s message: ' + message.cleanContent + ' has been deleted.')
    }
  }
})
client.on('guildMemberAdd', function (guild, member) {
  let defaultChannel = ''
  // checks each channel in the server and finds the first one it can send messages in text to
  guild.channels.forEach((channel) => {
    if (channel.type === 'text' && defaultChannel === '') {
      if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
        defaultChannel = channel
      }
    }
  })
  // welcoming new users
  var chanceOfGlitch = getRandomNumber(12)
  var guildname = guild.name
  if (chanceOfGlitch === 4) {
    defaultChannel.send('/tts ***LOCKDOWN LOCKDOWN LOCKDOWN***')
    defaultChannel.send('/tts Unauthorized user detected.')
  } else {
    defaultChannel.send('Welcome, ' + member.username + ' to ' + guildname + ', I hope you have a great time here!')
  }
})
// event handler that sends message to a log when important (externally editable) user statuses change (for example nickname)
// citation: discord logger, richard kriesman
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
    // switch statement that has cases for each change
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
// gets random number for if there is a function that changes every so often
function getRandomNumber (highest) {
  return Math.floor(Math.random() * Math.floor(highest))
}
// lists every element in an array
function listElements (array) {
  var text = ''
  for (var i = 0; i < array.length; i++) {
    text += '    ' + array[i] + '    '
  }
  return text
}
// Bot login token hidden in external variable within heroku. DO NOT PUT IN THIS FILE EVER!!!!!!!!!
client.login(process.env.BOT_TOKEN)
