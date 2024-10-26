const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    channelId: { type: String, required: true },
    ticketNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: "open" }
});

module.exports = mongoose.model("Ticket", ticketSchema);