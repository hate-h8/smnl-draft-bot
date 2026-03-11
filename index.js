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

client.on('messageCreate', async message => {

  if(message.author.bot) return;

  // START DRAFT
  if(message.content.startsWith('!draftstart')){
    draftOrder = message.mentions.users.map(user => user.id);
    currentPick = 0;
    draftActive = true;

    if(draftOrder.length === 0){
      message.reply("You must mention the draft order.");
      return;
    }

    const firstUser = `<@${draftOrder[0]}>`;
    message.channel.send(`Draft started! ${firstUser} is on the clock.`);
  }

  // MAKE PICK
  if(message.content.startsWith('!pick')){

    if(!draftActive){
      message.reply("Draft is not active.");
      return;
    }
    const player = message.content.split(' ').slice(1).join(' ');

    if(!player){
      message.reply("Please include a player name.");
      return;
    }

    const currentUser = draftOrder[currentPick];

    if(message.author.id !== currentUser){
      message.reply("It is not your turn.");
      return;
    }

    message.channel.send(`${player} drafted by <@${currentUser}>`);
    currentPick++;

    if(currentPick >= draftOrder.length){
      message.channel.send("Round complete.");
      draftActive = false;
      return;
    }

    const nextUser = `<@${draftOrder[currentPick]}>`;
    message.channel.send(`${nextUser} is now on the clock.`);
  }

});

client.login(process.env.DISCORD_TOKEN);