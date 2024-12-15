const TicketModel = require("../models/TicketModel");
const { EmbedBuilder } = require("discord.js");

// ฟังก์ชันสำหรับการปิด Ticket
async function handleTicketClose(interaction) {
    const channel = interaction.channel;

    // ตรวจสอบว่า channel นี้เป็น ticket หรือไม่
    if (interaction.channel.name.startsWith("ticket-")) {
        // ค้นหาข้อมูล ticket จากฐานข้อมูลโดยใช้ channelId
        const ticket = await TicketModel.findOne({ channelId: channel.id })

        // หากไม่พบข้อมูล ticket ในฐานข้อมูล
        if (!ticket) {
            return interaction.reply({ content: "ไม่พบข้อมูล ticket ในฐานข้อมูล", ephemeral: true });
        }

        // ลบข้อมูล ticket ออกจากฐานข้อมูล
        await TicketModel.deleteOne({ channelId: channel.id });

        // สร้าง Embed เพื่อแจ้งว่า Ticket ถูกปิดแล้ว
        const closeEmbed = new EmbedBuilder()
            .setAuthor({ name: "NekoTicket", iconURL: interaction.user.displayAvatarURL() }) // ชื่อและรูปโปรไฟล์ผู้ใช้
            .setColor("LuminousVividPink") // สีของ Embed
            .setTitle(`Ticket-#${ticket.ticketNumber} ปิดเรียบร้อยแล้ว!`) // หัวข้อ Embed
            .setDescription("Ticket นี้จะถูกลบภายใน 5 วินาที") // คำอธิบาย
            .setTimestamp(); // เวลาที่ Embed ถูกสร้าง

        // ตอบกลับด้วย Embed แจ้งปิด Ticket
        await interaction.reply({ embeds: [closeEmbed] });

        // รอ 5 วินาที ก่อนที่จะลบช่อง
        setTimeout(() => {
            channel.delete().catch(err => console.error("เกิดข้อผิดพลาดในการลบช่อง", err)); // ลบช่อง และจับข้อผิดพลาดหากเกิดขึ้น
        }, 5000);
    } else {
        // หากช่องไม่ใช่ช่องสำหรับ Ticket
        await interaction.reply({ content: "ช่องนี้ไม่ใช่ ช่องสำหรับ Ticket", ephemeral: true });
    }
}

// ส่งออกฟังก์ชัน handleTicketClose สำหรับใช้งานในไฟล์อื่น
module.exports = handleTicketClose;
