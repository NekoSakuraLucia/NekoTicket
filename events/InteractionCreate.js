// นำเข้าโมดูลที่เกี่ยวข้องสำหรับการจัดการ Ticket
const handleTicketClose = require("../separate/TicketClose");
const handleTicketCreation = require("../separate/TicketCreation");

module.exports = {
    name: "interactionCreate", // ตั้งชื่อเหตุการณ์สำหรับการจัดการ interaction
    async execute(interaction, client) {
        // ตรวจสอบว่า interaction เป็นคำสั่ง (command) หรือไม่
        if (interaction.isCommand()) {
            // ค้นหาคำสั่งที่ตรงกับชื่อคำสั่งที่ได้รับจาก interaction
            const command = client.commands.get(interaction.commandName);

            // หากไม่พบคำสั่งที่ตรงกันก็จะออกจากฟังก์ชัน
            if (!command) return;

            // พยายามดำเนินการคำสั่งที่เลือก
            try {
                await command.execute(interaction);
            } catch (error) {
                // หากเกิดข้อผิดพลาดระหว่างการดำเนินการคำสั่ง
                console.error(error);
                // ส่งข้อความตอบกลับเมื่อเกิดข้อผิดพลาด
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        // หาก interaction เป็นปุ่ม (button) จะทำการตรวจสอบ customId ของปุ่ม
        else if (interaction.isButton()) {
            switch (interaction.customId) {
                // หากกดปุ่ม "confirm_ticket" จะเรียกใช้ฟังก์ชันสร้าง Ticket ใหม่
                case "confirm_ticket":
                    await handleTicketCreation(interaction, client);
                    break;
                // หากกดปุ่ม "cancel_ticket" จะตอบกลับว่า "ยกเลิกการเปิด Ticket แล้ว"
                case "cancel_ticket":
                    await interaction.update({ content: "ยกเลิกการเปิด Ticket แล้ว!", components: [] });
                    break;
                // หากกดปุ่ม "close_ticket" จะเรียกใช้ฟังก์ชันปิด Ticket
                case "close_ticket":
                    await handleTicketClose(interaction, client);
                    break;
            }
        }
    }
}
