require("dotenv").config();

const { fs } = require("node:fs");
const { path } = require("node:path");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const Discord = require("discord.js");
const { Collection } = require("discord.js");

// Create a new Discord client
const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds] });

//Create command collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

//Retrieve command files...
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Login to Discord
client.login(process.env.TOKEN);

// Handle the 'ready' event
client.on("ready", () => {
  console.log("Logged in as ${client.user.tag}");
});

// Handle the 'message' event
client.on("message", (message) => {
  // If the message is from the bot itself, ignore it
  if (message.author.bot) return;

  // Respond to the message with a simple greeting
  message.channel.send("Hello, ${message.author.username}!");

  client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });
});
