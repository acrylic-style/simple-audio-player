require('dotenv').config()
const { joinVoiceChannel, createAudioPlayer, AudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice')
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })
const { demuxProbe, createAudioResource } = require('@discordjs/voice')
const https = require('https')

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream)
	return createAudioResource(stream, { inputType: type })
}

/**
 * @param {string} url 
 * @returns {Promise<AudioResource<any>>}
 */
const createResource = (url) => new Promise(resolve => https.get(url, (stream) => resolve(probeAndCreateResource(stream))))

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName === 'play') {
    const url = interaction.options.getString('url', true)
    const connection = joinVoiceChannel({
      guildId: interaction.guildId,
      channelId: interaction.member?.voice?.channelId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    })
    const player = createAudioPlayer()
    player.play(await createResource(url))
    connection.subscribe(player)
    player.on(AudioPlayerStatus.Idle, () => connection.destroy())
    connection.on('stateChange', () => {
      if (connection.state === VoiceConnectionStatus.Disconnected) {
        connection.destroy()
      }
    })
    interaction.reply({ content: 'ﾖｼ!' })
  }
})

client.login(process.env.TOKEN)
