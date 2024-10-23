async function handleTicketClose(interaction, client) {
    if (interaction.channel.name.startsWith("ticket-")) {
        await interaction.reply({ content: "ปิด Ticket แล้ว.." });
        setTimeout(() => interaction.channel.delete(), 5000);
    } else {
        await interaction.reply({ content: "ช่องนี้ไม่ใช่ ช่องสำหรับ Ticket", ephemeral: true });
    }
}

module.exports = handleTicketClose;