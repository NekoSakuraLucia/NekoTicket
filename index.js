const { Client, GatewayIntentBits, REST, Routes, Collection } = require("discord.js");
const path = require("path");
const fs = require("fs");
const { TOKEN } = require("./config.json");
const chalk = require("chalk");

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
        this.loadEvents();
        this.setupEventHandlers();
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || fs.lstatSync(path.join(commandsPath, file)).isDirectory());

        this.commandsToDeploy = [];

        console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> ${chalk.default.green('Loading Commands...')}`));

        for (const folderOrFile of commandFiles) {
            const fullPath = path.join(commandsPath, folderOrFile);

            if (fs.lstatSync(fullPath).isDirectory()) {
                const folderPath = fullPath;
                const commandFilesInFolder = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

                for (const file of commandFilesInFolder) {
                    const command = require(path.join(folderPath, file));
                    this.client.commands.set(command.data.name, command);
                    this.commandsToDeploy.push(command.data.toJSON());
                    console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> ${chalk.default.green(`Loaded Slash Commands ${command.data.name} from /${folderOrFile}/${file}`)}`));
                }
            } else {
                const command = require(fullPath);
                this.client.commands.set(command.data.name, command);
                this.commandsToDeploy.push(command.data.toJSON());
                console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> ${chalk.default.green(`Loaded Commands ${command.data.name} from /${folderOrFile}`)}`));
            }
        }
    }

    loadEvents() {
        const eventsPath = path.join(__dirname, "events")
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args, this.client));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args, this.client));
            }

            console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> ${chalk.default.green(`Loaded Events ${event.name}`)}`));
        }

        console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> Loading All Events Successfully !`));
    }

    async deployCommands() {
        const rest = new REST({ version: '10' }).setToken(TOKEN);

        try {
            await rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: this.commandsToDeploy },
            );

            console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> Loading All Commands Successfully !`));
        } catch (error) {
            console.error(error);
        }
    }

    setupEventHandlers() {
        this.client.once('ready', async () => {
            console.log(chalk.default.green(`[${chalk.default.white('NekoTicket')}] -> [${chalk.default.white('INFO')}] -> Logged in as ${this.client.user.tag}!`));
            await this.deployCommands();
        });
    }

    login() {
        this.client.login(TOKEN);
    }
}

const bot = new NekoTicket();
bot.login();