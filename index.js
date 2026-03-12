const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let draftOrder = [];
let currentPick = 0;
let draftActive = false;
const TOTAL_ROUNDS = 2; // will be 22
let CURRENT_ROUND = 0;

// Snake Draft Logic
function getCurrentDrafter() { 
  const index = currentPick % draftOrder.length;
  if (CURRENT_ROUND % 2 === 1) return draftOrder[index]; // normal order
  else return draftOrder[draftOrder.length - 1 - index]; // reverse order
}



client.once('ready', () => {
  console.log('Draft Bot Online');
});

client.on('messageCreate', async message => {

  if(CURRENT_ROUND > TOTAL_ROUNDS) {
    message.channel.send(`Draft complete!`);
    return;
  }

  if(message.author.bot) return;

  // START DRAFT
  if(message.content.startsWith('!draftstart')){
    draftOrder = message.mentions.users.map(user => user.id);
    draftActive = true;
    if(draftOrder.length === 0){
      message.reply("You must mention the draft order.");
      return;
    }
    CURRENT_ROUND++; // start round 1
    const firstUser = `<@${getCurrentDrafter()}>`;
    message.channel.send(`Draft started! ${firstUser} is on the clock.`);
  }

  // MAKE PICK
  if(message.content.startsWith('!draft')){
    if(!draftActive){
      message.reply("Draft is not active.");
      return;
    }
    const player = message.content.split(' ').slice(1).join(' ');
    if(!player){
      message.reply("Please include a player name.");
      return;
    }

    const currentUser = getCurrentDrafter();
    if(message.author.id !== currentUser){
      message.reply("It is not your turn.");
      return;
    }
    message.channel.send(`${player} drafted by <@${currentUser}>`);
    currentPick++;
    if(currentPick % draftOrder.length === 0) CURRENT_ROUND++; // Start next round
    const nextUser = `<@${getCurrentDrafter()}>`;
    message.channel.send(`${nextUser} is now on the clock.`);
  }
});

client.login(process.env.DISCORD_TOKEN);