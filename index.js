const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require(path.join(__dirname, 'config.json'));
const { updateAllUsersLeetcodeStats } = require(path.join(__dirname, 'connection', 'leetcodeAPI'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);


cron.schedule('*/45 * * * *', () => {
	console.log('Running cron job to update user stats every 45 minutes!');
	updateAllUsersLeetcodeStats();
});