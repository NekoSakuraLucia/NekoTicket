const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ticket").setDescription("Open a ticket to report your server error or others."),
    async execute(interaction) {
        await interaction.reply("Ticket")
    }
}