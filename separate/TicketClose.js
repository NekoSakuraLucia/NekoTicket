const TicketModel = require("../models/TicketModel");
const { EmbedBuilder } = require("discord.js");

async function handleTicketClose(interaction) {
    const channel = interaction.channel;

    if (interaction.channel.name.startsWith("ticket-")) {
        const ticket = await TicketModel.findOne({ channelId: channel.id })

        if (!ticket) {
            return interaction.reply({ content: "ไม่พบข้อมูล ticket ในฐานข้อมูล", ephemeral: true });
        }

        await TicketModel.deleteOne({ channelId: channel.id });

        const closeEmbed = new EmbedBuilder()
            .setAuthor({ name: "NekoTicket", iconURL: interaction.user.displayAvatarURL() })
            .setColor("LuminousVividPink")
            .setTitle(`Ticket-#${ticket.ticketNumber} ปิดเรียบร้อยแล้ว!`)
            .setDescription("Ticket นี้จะถูกลบภายใน 5 วินาที")
            .setTimestamp();

        await interaction.reply({ embeds: [closeEmbed] });

        setTimeout(() => {
            channel.delete().catch(err => console.error("เกิดข้อผิดพลาดในการลบช่อง", err));
        }, 5000);
    } else {
        await interaction.reply({ content: "ช่องนี้ไม่ใช่ ช่องสำหรับ Ticket", ephemeral: true });
    }
}

module.exports = handleTicketClose;