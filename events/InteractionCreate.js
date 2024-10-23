const { ChannelType, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === "confirm_ticket") {
                const existingTickets = interaction.guild.channels.cache.filter(channel => channel.name.startsWith("ticket-")).size;
                const ticketNumber = String(existingTickets + 1).padStart(3, "0")

                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${ticketNumber}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel], // ซ่อนห้องจากสมาชิกปกติ / Hide rooms from regular members
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages
                            ], // อนุญาตให้ผู้เปิด ticket ดูและพิมพ์ข้อความได้ / Allows the ticket opener to view and type messages.
                        },
                        {
                            id: client.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages
                            ] // อนุญาตให้บอทจัดการห้องได้ / Allow bots to manage rooms
                        }
                    ]
                });

                const ticketEmbed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTitle(`Ticket-#${ticketNumber}`)
                    .setDescription(`สวัสดี ${interaction.user}, กรุณาระบุปัญหาหรือข้อสงสัยของคุณในห้องนี้\n\n**โปรดระบุ:**\n- สาเหตุที่เปิด ticket\n- รายละเอียดปัญหา\n- ข้อมูลเพิ่มเติมที่เกี่ยวข้อง`)
                    .setFooter({ text: 'ทีมงานจะตอบกลับให้เร็วที่สุด' })
                    .setTimestamp();

                await ticketChannel.send({ embeds: [ticketEmbed] })

                await interaction.update({ content: `สร้าง ticket เรียบร้อยแล้ว: ticket-${ticketNumber}`, embeds: [], components: [] });
            }
        }
    }
}