const {
    EmbedBuilder,
    ActionRowBuilder,
    ChannelType,
    PermissionsBitField,
    ButtonStyle,
    ButtonBuilder
} = require("discord.js");

async function handleTicketCreation(interaction, client) {
    const existingTickets = interaction.guild.channels.cache.filter(channel => channel.name.startsWith("ticket-")).size;
    const ticketNumber = String(existingTickets + 1).padStart(3, "0");

    const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${ticketNumber}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: client.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
        ],
    });

    const ticketEmbed = new EmbedBuilder()
        .setColor("LuminousVividPink")
        .setTitle(`Ticket #${ticketNumber}`)
        .setDescription(`สวัสดี ${interaction.user}! กรุณาระบุปัญหาหรือข้อสงสัยของคุณในห้องนี้\n\n**โปรดระบุ:**\n- สาเหตุที่เปิด ticket\n- รายละเอียดปัญหา\n- ข้อมูลเพิ่มเติมที่เกี่ยวข้อง`)
        .setFooter({ text: 'ทีมงานจะตอบกลับให้เร็วที่สุด' })
        .setTimestamp();

    // ปุ่มสำหรับปิด ticket
    const closeTicketButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('🔒 Close Ticket')
                .setStyle(ButtonStyle.Danger)
        );

    // ส่งข้อความในห้อง ticket ใหม่
    await ticketChannel.send({ embeds: [ticketEmbed], components: [closeTicketButton] });

    await interaction.update({ content: `สร้าง ticket แล้ว: ${ticketChannel}`, embeds: [], components: [] });
}

module.exports = handleTicketCreation;