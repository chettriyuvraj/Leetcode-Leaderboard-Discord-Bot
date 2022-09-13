const path = require('node:path');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.commands.deregister;
const { SlashCommandBuilder } = require('discord.js');
const { deleteUser } = require(path.join(__dirname, '..', 'sequelize', 'deleteEntry'));
const { connectAndReturnAllTables } = require(path.join(__dirname, '..', 'sequelize', 'sequelize'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName(LOCALCONSTANTS.name)
		.setDescription(LOCALCONSTANTS.description)
		.addStringOption(option =>
			option.setName(LOCALCONSTANTS.options.string.leetcodeUsername.name)
				.setDescription(LOCALCONSTANTS.options.string.leetcodeUsername.description)
				.setRequired(LOCALCONSTANTS.options.string.leetcodeUsername.required)),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			const leetcodeUsername = interaction.options.getString(LOCALCONSTANTS.options.string.leetcodeUsername.name);
			const { userTable, questionSolvedTable } = await connectAndReturnAllTables();
			await deleteUser(
				leetcodeUsername,
				interaction.user.id,
				interaction.guild.id,
				userTable,
				questionSolvedTable);
			await interaction.editReply('Successfully deregistered user!');
		}
		catch (error) {
			if (error.name === CONSTANTS.errors.NoSuchUserExistsError) {
				await interaction.editReply(error.message);
			}
			else {
				await interaction.editReply('Error while de-registering user!');
			}
		}
	},
};