const path = require('node:path');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.events.interactionCreate;

module.exports = {
	name: LOCALCONSTANTS.name,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;
		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};