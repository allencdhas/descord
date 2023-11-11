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
});
