// นำเข้า mongoose เพื่อใช้งานในการเชื่อมต่อกับฐานข้อมูล MongoDB
const mongoose = require("mongoose");

// กำหนด schema สำหรับ Ticket
const ticketSchema = new mongoose.Schema({
    // userId คือ รหัสผู้ใช้ที่สร้าง ticket (ชนิดข้อมูลเป็น String)
    userId: { type: String, required: true },
    // channelId คือ รหัสของช่องที่เกี่ยวข้องกับ ticket (ชนิดข้อมูลเป็น String)
    channelId: { type: String, required: true },
    // ticketNumber คือ หมายเลขของ ticket ที่ใช้ในการระบุ (ชนิดข้อมูลเป็น String)
    ticketNumber: { type: String, required: true },
    // createdAt คือ เวลาที่ ticket ถูกสร้าง (ชนิดข้อมูลเป็น Date) ค่าเริ่มต้นคือเวลาปัจจุบัน
    createdAt: { type: Date, default: Date.now },
    // status คือ สถานะของ ticket เช่น "open", "closed" (ชนิดข้อมูลเป็น String) ค่าเริ่มต้นคือ "open"
    status: { type: String, default: "open" }
});

// ส่งออกโมเดล Ticket ที่ใช้ schema ที่กำหนดไว้
module.exports = mongoose.model("Ticket", ticketSchema);
