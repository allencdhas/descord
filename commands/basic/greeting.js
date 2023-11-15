const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("greeting")
    .setDescription("Replies with Hi!"),

  async execute(interaction) {
    await interaction.reply("Hi!");
  },
};
