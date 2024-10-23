const handleTicketClose = require("../separate/TicketClose");
const handleTicketCreation = require("../separate/TicketCreation");

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
            switch (interaction.customId) {
                case "confirm_ticket":
                    await handleTicketCreation(interaction, client);
                    break;
                case "cancel_ticket":
                    await interaction.update({ content: "ยกเลิกการเปิด Ticket แล้ว!", components: [] });
                    break;
                case "close_ticket":
                    await handleTicketClose(interaction, client);
                    break;
            }
        }
    }
}