const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Draft Bot Online');
});

client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('Draft bot working!');
  }
});

client.login(process.env.DISCORD_TOKEN);