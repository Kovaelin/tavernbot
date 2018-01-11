//All the custom stuff, separated by converns
const dungeonary = require('./dungeonary')
const discordlib = require('./discordlib')

const Discord = require("discord.js")
const client = new Discord.Client()
const { token, botkey, defaultChannel, gameStatus } = require("./config.json")

// In case something happens, we'll want to see logs
client.on("error", (e) => console.error(e))

// Startup callback
client.on('ready', () => {
  console.log(`I'm rolling initiative as ${client.user.tag}!`)
  client.user.setPresence({
    "status": "online",
    "game": { "name" : gameStatus }
  })
})

// Command central
client.on('message', msg => {
  // Let's hook it up for a default channel and DMs
  if ( msg.channel.name == defaultChannel || msg.channel.recipient ){
    //Make sure we care, and that we're not making ourselves care
    if ( !msg.content.trim().startsWith(botkey) || msg.author.bot) return
    //Remove botkey and break it up into clean not-mixed-cased parts.
    let parts = msg.content.trim().toLowerCase().substring(1).split(/\s+/)
    let cmd = parts[0]
    let input = parts[1] ? parts.slice(1).join(' ') : '' //Some cmds have no input, this lets us use if(input)
    //From here, we check each lib until we find a match for execution, or we let the user know it's a no-go
    if ( cmd in dungeonary ) {
      console.log( 'Running dungeonary.'+cmd+' with input='+input+' for '+msg.author.username )
      msg.reply( dungeonary[cmd]( input ) )
    } else if ( cmd in discordlib ) {
      console.log( 'Running discordlib.'+cmd+' with input='+input+' for '+msg.author.username )
      msg.reply( discordlib[cmd]( input, msg, client ) )
    } else {
      msg.reply("I'm sorry "+msg.author.username+", I'm afraid I can't do that")
    }
  }
});

// Turning the key and revving the bot engine
client.login(token);
