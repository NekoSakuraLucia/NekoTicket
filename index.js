const { Client, GatewayIntentBits, REST, Routes, Collection } = require("discord.js");
const path = require("path")
const fs = require("fs")
const { TOKEN } = require("./config.json");

class NekoTicket {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
        this.client.commands = new Collection()
        this.loadCommands();
        this.setupEventHandlers();
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || fs.lstatSync(path.join(commandsPath, file)).isDirectory());

        this.commandsToDeploy = [];

        console.log("Loading Commands..");

        for (const folderOrFile of commandFiles) {
            const fullPath = path.join(commandsPath, folderOrFile);

            if (fs.lstatSync(fullPath).isDirectory()) {
                const folderPath = fullPath;
                const commandFilesInFolder = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

                for (const file of commandFilesInFolder) {
                    const command = require(path.join(folderPath, file));
                    this.client.commands.set(command.data.name, command);
                    this.commandsToDeploy.push(command.data.toJSON());
                    console.log(`Loaded command: ${command.data.name} from /${folderOrFile}/${file}`);  // แสดงชื่อคำสั่งที่โหลดจากโฟลเดอร์
                }
            } else {
                const command = require(fullPath);
                this.client.commands.set(command.data.name, command);
                this.commandsToDeploy.push(command.data.toJSON());
                console.log(`Loaded command: ${command.data.name} from /${folderOrFile}`);  // แสดงชื่อคำสั่งที่โหลดจากไฟล์โดยตรง
            }
        }

        console.log('All commands loaded.');
    }

    async deployCommands() {
        const rest = new REST({ version: '10' }).setToken(TOKEN);

        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: this.commandsToDeploy },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    setupEventHandlers() {
        this.client.once('ready', async () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
            await this.deployCommands();
        });

        // ทดสอบเท่านั้นไม่ได้นำมาใช้จริง
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }

    login() {
        this.client.login(TOKEN);
    }
}

const bot = new NekoTicket();
bot.login();