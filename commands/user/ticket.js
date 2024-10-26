const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ticket").setDescription("Open a ticket to report your server error or others."),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        // สร้าง embed สำหรับคำสั่ง ticket
        const embed = new EmbedBuilder()
            .setAuthor({ name: "NekoTicket", iconURL: interaction.user.displayAvatarURL() })
            .setColor("LuminousVividPink")
            .setTitle("Open Ticket !")
            .setDescription("Are you sure you want to open ticket? Please confirm below.");

        // สร้างปุ่มสำหรับการยืนยัน
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_ticket')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('cancel_ticket')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.editReply({ embeds: [embed], components: [row] })
    }
}