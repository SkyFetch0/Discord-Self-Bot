const { Client, Intents } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios'); 

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const prefix = config.prefix;


client.commands = new Map();

const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`${client.user.username} is ready!`);
 
});
client.on('messageCreate', message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return; 

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) {
        return message.reply('Invalid command!').catch(console.error);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!').catch(console.error);
    }
});


client.login(config.token);
