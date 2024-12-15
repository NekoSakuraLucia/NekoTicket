const {
    EmbedBuilder,
    ActionRowBuilder,
    ChannelType,
    PermissionsBitField,
    ButtonStyle,
    ButtonBuilder
} = require("discord.js");
const TicketModel = require("../models/TicketModel");

// ฟังก์ชันสำหรับสร้าง Ticket ใหม่
async function handleTicketCreation(interaction, client) {
    // คำนวณจำนวน ticket ที่มีอยู่ในเซิร์ฟเวอร์ปัจจุบัน
    const existingTickets = interaction.guild.channels.cache.filter(channel => channel.name.startsWith("ticket-")).size;

    // สร้างหมายเลข ticket โดยเพิ่ม 1 ให้กับจำนวน ticket ที่มีอยู่
    const ticketNumber = String(existingTickets + 1).padStart(3, "0");

    // สร้างช่องใหม่สำหรับ Ticket โดยกำหนดชื่อและสิทธิ์
    const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${ticketNumber}`, // ชื่อช่องที่ใช้หมายเลข ticket
        type: ChannelType.GuildText, // ประเภทของช่องเป็น GuildText
        permissionOverwrites: [
            {
                id: interaction.guild.id, // ปฏิเสธการมองเห็นช่องสำหรับทุกคนในเซิร์ฟเวอร์
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id, // ให้สิทธิ์การมองเห็นและส่งข้อความเฉพาะผู้ใช้ที่เปิด ticket
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: client.user.id, // ให้สิทธิ์การมองเห็นและส่งข้อความสำหรับบอท
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
        ],
    });

    // สร้าง Embed สำหรับแสดงข้อความใน Ticket ใหม่
    const ticketEmbed = new EmbedBuilder()
        .setColor("LuminousVividPink") // สีของ Embed
        .setTitle(`Ticket #${ticketNumber}`) // ชื่อเรื่องของ Embed
        .setDescription(`สวัสดี ${interaction.user}! กรุณาระบุปัญหาหรือข้อสงสัยของคุณในห้องนี้\n\n**โปรดระบุ:**\n- สาเหตุที่เปิด ticket\n- รายละเอียดปัญหา\n- ข้อมูลเพิ่มเติมที่เกี่ยวข้อง`) // คำแนะนำให้ผู้ใช้กรอกข้อมูล
        .setFooter({ text: 'ทีมงานจะตอบกลับให้เร็วที่สุด' }) // ข้อความที่แสดงที่ส่วนท้าย
        .setTimestamp(); // เวลาที่ Embed ถูกสร้าง

    // สร้างปุ่มสำหรับปิด ticket
    const closeTicketButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket') // ID สำหรับระบุการกระทำ
                .setLabel('🔒 Close Ticket') // ป้ายบนปุ่ม
                .setStyle(ButtonStyle.Danger) // สีของปุ่ม
        );

    // ส่งข้อความไปยังช่องที่สร้างใหม่พร้อมกับ Embed และปุ่ม
    await ticketChannel.send({ embeds: [ticketEmbed], components: [closeTicketButton] });

    // บันทึกข้อมูล ticket ใหม่ลงในฐานข้อมูล
    const ticket = new TicketModel({
        userId: interaction.user.id, // รหัสผู้ใช้ที่เปิด ticket
        channelId: ticketChannel.id, // รหัสช่องของ ticket
        ticketNumber: ticketNumber // หมายเลขของ ticket
    });

    await ticket.save(); // บันทึกข้อมูล

    // ตอบกลับการสร้าง ticket สำเร็จ
    await interaction.update({ content: `สร้าง ticket แล้ว: ${ticketChannel}`, embeds: [], components: [] });
}

// ส่งออกฟังก์ชัน handleTicketCreation สำหรับใช้งานในไฟล์อื่น
module.exports = handleTicketCreation;
