// Class defines what discord commands will exist and how to respond to them
const { Client, GatewayIntentBits } = require('discord.js');
const draft = require("./draftEngine");
const timer = require("./timer");
const sheets = require("./sheets");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/**
 * Discord commands
 */
client.on('messageCreate', async message => {
  if(message.author.bot) return; // ignore self

  // START DRAFT
  if(message.content.startsWith('!startdraft')) {
    const order = message.mentions.users.map(user => user.id);
    if(order.length === 0){
      message.reply("You must mention the draft order.");
      return;
    }
    draft.setDraftOrder(order);

    // Start first pick
    draft.startDraft();
    message.channel.send(`Draft started!`);
    timer.startTimer(message.channel, draft.getCurrentDrafter, () => {
      draft.advancePick();
    });
  }

  // MAKE PICK
  if(message.content.startsWith('!draft')){
    if(!draft.isDraftActive()) {
      message.channel.send("Draft is inactive.");
      return;
    }

    const player = message.content.split(' ').slice(1).join(' ');
    if(!player) {
      message.channel.send("Please enter a player name.");
      return;
    }

    const currentDrafter = draft.getCurrentDrafter();
    if(message.author.id !== currentDrafter){
      message.reply("It is not your turn.");
      return;
    }

    // sheets logic goes here //

    timer.stopTimer();
    message.channel.send(`${player} drafted by <@${currentDrafter}>`);
    draft.advancePick();
    if(draft.draftFinished()) {
      draft.endDraft();
      message.channel.send(`Draft complete!`);
      return;
   }

    // Start next pick
    const nextDrafter = draft.getCurrentDrafter();
    message.channel.send(`${nextDrafter} is now on the clock.`);
    timer.startTimer(message.channel, draft.getCurrentDrafter, () => {
      draft.advancePick();
    });
  }
});

client.login(process.env.DISCORD_TOKEN);