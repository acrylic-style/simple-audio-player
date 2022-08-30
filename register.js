require('dotenv').config()
const { REST, Routes } = require('discord.js')

const commands = [
  {
    name: 'play',
    description: 'Plays a single audio file.',
    options: [
      {
        name: 'url',
        description: 'The URL of the file',
        type: 3,
        required: true,
      }
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

!(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    const clientId = Buffer.from(process.env.TOKEN.substring(0, process.env.TOKEN.indexOf('.')), 'base64').toString('ascii')
    await rest.put(Routes.applicationCommands(clientId), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (e) {
    console.error(e)
  }
})()
