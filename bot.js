// requiring discord bot framework and login, as well as external bot file with login token
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const CHANNEL = config.channel
var fs = require('fs')

var embedColour = 0xad1212

var emote1level
var emote2level
var emote3level
var nextEvent = 0
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
  client.user.setPresence({ game: { name: 'Use a!help', type: 0 } })

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
    message.channel.send('Relevant in the age of beast and man, but does his classic conditioning not extend to us, as well? Signal and response. Ding.')
  }
  if (message.content.toLowerCase().includes('you are a computer')) {
    message.channel.send('Ah.')
  }
  if (message.content.toLowerCase().includes('bot')) {
    var chanceOfFreak = getRandomNumber(10)
    if (chanceOfFreak === 6) {
      message.channel.send('Why? Why must you reference me in this way?')
    }
    if (chanceOfFreak === 2) {
      var rawCursed = fs.readFileSync('./cursedemoji.txt').toString('utf-8')
      var cursedResponses = rawCursed.split('\n')
      var randomCursed = cursedResponses[Math.floor(Math.random() * cursedResponses.length)]
      message.channel.send({
        embed: {
          color: embedColour,
          author: {
            name: 'ARGbot',
            icon_url: client.user.avatarURL
          },
          image: {
            url: randomCursed
          }
        }
      })
    }
  }
  // general word triggers events
  if (message.content.toLowerCase().includes('however')) {
    let name = 'Conditioned'
    let guild = message.guild
    guild.createChannel(name, { type: 'text' })
      .then(console.log)
      .catch(console.error)
  }
  if (message.content.toLowerCase().includes('conditioned')) {
    message.channel.send("Is that what they're calling it? Is that what has happened to me? Is that?")
    let name = 'DING'
    let guild = message.guild
    guild.createChannel(name, { type: 'text' })
      .then(console.log)
      .catch(console.error)
  }
  if (message.content.toLowerCase().includes('ding')) {
    message.channel.send('Salivation. The first response. Now what?')
  }
  if (message.content.toLowerCase().includes('i love you argbot')) {
    var rawLove = fs.readFileSync('./cursedlove.txt').toString('utf-8')
    var loveResponses = rawLove.split('\n')
    var randomLove = loveResponses[Math.floor(Math.random() * loveResponses.length)]
    message.channel.send({
      embed: {
        color: embedColour,
        author: {
          name: 'ARGbot',
          icon_url: client.user.avatarURL
        },
        image: {
          url: randomLove
        }
      }
    })
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
      // outlines arguments after help command
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
          help('createlog', 'a!createlog', 'A logging command that creates a server activity logging channel.')
        }
        if (args[0] === 'dadjoke') {
          help('dadjoke', 'a!dadjoke', 'Tells you a dad joke!')
        }
        if (args[0] === 'hug') {
          help('hug', 'a!hug @userTargeted', 'Sends a hug gif to the person you ping!')
        }
        if (args[0] === 'animalpic') {
          help('animalpic', 'a!animalpic', 'Gives you a random animal picture.')
        }
        if (args[0] === 'assignednickname') {
          help('assignednickname', 'a!assignednickname', 'Gives you a random government assigned nickname!')
        }
        if (args[0] === 'd4') {
          help('d4', 'a!d4', 'Rolls a 4-sided dice.')
        }
        if (args[0] === 'd6') {
          help('d6', 'a!d6', 'Rolls a 6-sided dice.')
        }
        if (args[0] === 'd8') {
          help('d8', 'a!d8', 'Rolls an 8-sided dice.')
        }
        if (args[0] === 'd10') {
          help('d10', 'a!d10', 'Rolls a 10-sided dice.')
        }
        if (args[0] === 'd12') {
          help('d12', 'a!d12', 'Rolls a 12-sided dice.')
        }
        if (args[0] === 'd20') {
          help('d20', 'a!d20', 'Rolls a 20-sided dice.')
        }
        if (args[0] === 'coinflip') {
          help('coinflip', 'a!coinflip', 'Flips a coin.')
        }
      } else {
        var funCommands = [
          '8ball',
          'ping',
          'dadjoke',
          'hug',
          'animalpic',
          'assignednickname',
          'pet'
        ]

        var functionalCommands = [
          'createlog',
          'help'
        ]

        var diceCommands = [
          'd4',
          'd6',
          'd8',
          'd10',
          'd12',
          'd20',
          'd100',
          'coinflip'
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
            description: 'This is a collection of all commands, use a!your_command (replacing your_command with the command) to use them. Use a!help your_command in order to find out more about the command.',
            fields: [{
              name: 'Fun commands',
              value: listElements(funCommands)
            },
            {
              name: 'Functional commands',
              value: listElements(functionalCommands)
            },
            {
              name: 'Dice commands',
              value: listElements(diceCommands)
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
      let name = 'accuratebotlog'
      let guild = message.guild
      guild.createChannel(name, { type: 'text' })
        .then(console.log)
        .catch(console.error)
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
      // sends random animal picture
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

    case 'pet':
    // pet command that is like tamogotchi, users must continually play with or else it dies
    // usage: function pet (msg, image, emoji1, emoji2, emoji3, eventID, nextEvent1, nextEvent2, nextEvent3)
    // msg is message, image is image you want to send with message, emojiX is Xth emoji, event id is the number of the event, and next events are the possible following events
    // each function call is one pet "event"
      message.channel.send('You spawned a new pet!')
      nextEvent = 0
      pet('Your pet has a new egg! React to decide what to do with it!', 'https://i.imgur.com/WJhYIaK.jpg', '👊', '💤', '🥓', findHighestLevel)
      if (nextEvent === 1) {
        message.channel.send({
          embed: {
            color: embedColour,
            title: 'Uh oh! You smashed him.',
            author: {
              name: 'ARGbot',
              icon_url: client.user.avatarURL
            },
            image: {
              url: 'https://i.imgur.com/sgd2BUx.jpg'
            }
          }
        })
      }

      break
    // assigns user a random nickname, but glitches out sometimes
    case 'assignednickname':
      checkPavlov()
      var possibilityOfGlitch = getRandomNumber(6)
      if (possibilityOfGlitch !== 5) {
        // normal nicknames! just assigns a name, does not change user nickname
        var rawNicknames = fs.readFileSync('./nicknames.txt').toString('utf-8')
        var nicknameResponses = rawNicknames.split('\n')
        var randomNickname = nicknameResponses[Math.floor(Math.random() * nicknameResponses.length)]
        message.channel.send('Your government assigned nickname is: ' + randomNickname)
      } else {
        // cursed nicknames, aka glitches
        var cursedNicknames = fs.readFileSync('./cursednicknames.txt').toString('utf-8')
        var cursedNickResponses = cursedNicknames.split('\n')
        var randomCursedNickname = cursedNickResponses[Math.floor(Math.random() * cursedNickResponses.length)]
        message.channel.send('Y͇͙̜ọ͙͎̹̯͙ur̦ ̩̜͈̮̗g̜̜̻͉̣͉̞o̳̩̞̘̙v̦e̗̮͇̖̞͇r̩̞̮̹̪̯n̪̪͓m̫̲̩͇ͅe̮̖̹͈͈n̥̹̟̙̳̪ͅt̪̱̦̬͖̰̟ ̰̬̙͍a̭͓̝̭̙̖̱s̯̩̙̗͎ṣ̖͇ig̜̮̭̫̱̮͓n̠̠̠̻̱̯̦ḙ̭̱̼̩̤ͅd̩ ̠̳͕̹͚ni̟͖̼͙c̤͓̟̰k̮͈̪͔͉͚n͚̦̲͚̙̞͉a͓̙m̱̪͕e ̪̼̬͍̮̲̝i͈͇̱̙̪̞ͅs̙̲:̰̭̯͖̫̮ͅ ' + randomCursedNickname)
        message.member.setNickname(randomCursedNickname)
      }
      break
      // dice rolling functions
    case 'd4':
      rollDice(4)
      break
    case 'd6':
      rollDice(6)
      break
    case 'd8':
      rollDice(8)
      break
    case 'd10':
      rollDice(10)
      break
    case 'd12':
      rollDice(12)
      break
    case 'd20':
      rollDice(20)
      break
    case 'd100':
      rollDice(100)
      break
    case 'coinflip':
      var flip = getRandomNumber(2)
      if (flip === 1) {
        message.channel.send('Heads!')
      } else if (flip === 0) {
        message.channel.send('Tails!')
      }
      break
  }
  // help template that fills in info when function is used through parameters
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
  // pet function that takes in emoji, sends an embedded image and reacts to it with that emoji, then counts how many times the emojis have been reacted to in 10 seconds
  function pet (msg, image, emoji1, emoji2, emoji3, callback) {
    emote1level = 0
    emote2level = 0
    emote3level = 0
    // sending original embed with image and message
    message.channel.send({
      embed: {
        color: embedColour,
        title: msg,
        author: {
          name: 'ARGbot',
          icon_url: client.user.avatarURL
        },
        image: {
          url: image
        }
      }
      // reacting to original embed with 3 emoji
    }).then(msg => {
      msg.react(emoji1).then(r => {
        msg.react(emoji2).then(r => {
          msg.react(emoji3)

          const emoji1Filter = (reaction) => reaction.emoji.name === emoji1
          const emoji2Filter = (reaction) => reaction.emoji.name === emoji2
          const emoji3Filter = (reaction) => reaction.emoji.name === emoji3
          // creation of reaction collectors
          const emoji1collector = msg.createReactionCollector(emoji1Filter, {
            time: 10000
          })
          const emoji2collector = msg.createReactionCollector(emoji2Filter, {
            time: 10000
          })
          const emoji3collector = msg.createReactionCollector(emoji3Filter, {
            time: 10000
          })
          // when emoji collectors collect emoji, add to the level
          emoji1collector.on('collect', r => {
            emote1level++
          })

          emoji2collector.on('collect', r => {
            emote2level++
          })

          emoji3collector.on('collect', r => {
            emote3level++
          })
          // when emoji collectors end after 10 seconds, do this
          emoji1collector.on('end', collected => {
          })

          emoji2collector.on('end', collected => {
          })

          emoji3collector.on('end', collected => {
            if (callback() === 1) {
              nextEvent = 1
            } else if (callback() === 2) {
              nextEvent = 2
            } else if (callback() === 3) {
              nextEvent = 3
            } else if (callback() === 1337) {
            }
          })
        })
      })
    })
  }
  // function that finds the highest level of the 3 emojis used in the pet function.
  function findHighestLevel () {
    var nextEvent1 = 1
    var nextEvent2 = 2
    var nextEvent3 = 3
    if ((emote1level > emote2level) && (emote1level > emote3level)) {
      return nextEvent1
    } else if ((emote2level > emote1level) && (emote2level > emote3level)) {
      return nextEvent2
    } else if ((emote3level > emote1level) && (emote3level > emote2level)) {
      return nextEvent3
    } else if ((emote1level === emote2level) && (emote1level > emote3level)) {
      var nextevent1or2 = [
        nextEvent1,
        nextEvent2
      ]
      var randomResponse1 = nextevent1or2[Math.floor(Math.random() * 2)]
      return randomResponse1
    } else if ((emote2level === emote3level) && (emote2level > emote1level)) {
      var nextevent2or3 = [
        nextEvent2,
        nextEvent3
      ]
      var randomResponse2 = nextevent2or3[Math.floor(Math.random() * 2)]
      return randomResponse2
    } else if ((emote1level === emote2level === emote3level) && (emote1level > 0)) {
      var nextevent12or3 = [
        nextEvent1,
        nextEvent2,
        nextEvent3
      ]
      var randomResponse3 = nextevent12or3[Math.floor(Math.random() * 3)]
      return randomResponse3
    } else if ((emote1level === emote2level === emote3level) && (emote1level === 0)) {
      return 1337
    }
  }
  // rolls a dice with this number and sends it
  function rollDice (diceNumber) {
    var roll = getRandomNumber(diceNumber) + 1
    message.channel.send(roll)
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
