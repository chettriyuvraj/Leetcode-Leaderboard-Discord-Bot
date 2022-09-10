const path = require('node:path');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.commands.register;
const { SlashCommandBuilder } = require('discord.js');
const { getUserLeetcodeStats } = require(path.join(__dirname, '..', 'connection', 'leetcodeAPI'));
const { createEntry } = require(path.join(__dirname, '..', 'sequelize', 'createEntry'));
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
			const userStats = await getUserLeetcodeStats(leetcodeUsername);
			/* Saving user and their latest leetcode stats  */
			await createEntry(userTable, {
				leetcode_username: leetcodeUsername,
				discord_username: interaction.user.username,
				discord_tag: interaction.user.discriminator,
				discord_id: interaction.user.id,
				guild_id: interaction.guild.id,
			});
			await createEntry(questionSolvedTable, {
				leetcode_username: leetcodeUsername,
				discord_username: interaction.user.username,
				easy_solved: userStats.easy.count,
				medium_solved: userStats.medium.count,
				hard_solved: userStats.hard.count,
				total_solved: userStats.all.count,
			});
			await interaction.editReply(`Successfully registered user! You have solved a total of ${userStats.all.count} problems`);
		}
		catch (error) {
			if (error.name === CONSTANTS.errors.SequelizeUniqueConstraintError) {
				await interaction.editReply('User already registered on this server!');
			} else {
				await interaction.editReply('Error while registering user!');
			}
		}
	},
};

/* const mockAPI = async () => {
	await sleep(5000);
	return {
		all: { difficulty: 'All', count: 111, submissions: 253 },
		easy: { difficulty: 'Easy', count: 52, submissions: 129 },
		medium: { difficulty: 'Medium', count: 57, submissions: 118 },
		hard: { difficulty: 'Hard', count: 2, submissions: 6 },
	};
};

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
} */