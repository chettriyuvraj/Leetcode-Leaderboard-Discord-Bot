const path = require('node:path');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.commands.leaderboard;
const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboard } = require(path.join(__dirname, '..', 'sequelize', 'leaderboard'));
const { formulateLeaderboardBarChartData, formulateDifficultySegregatedLeaderboardBarChartData } = require(path.join(__dirname, '..', 'helpers', 'charts'));
const { createBarChartURL } = require(path.join(__dirname, '..', 'charts', 'charts'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName(LOCALCONSTANTS.name)
		.setDescription(LOCALCONSTANTS.description)
		.addStringOption(option =>
			option.setName(LOCALCONSTANTS.options.string.leaderboardType.name)
				.setDescription(LOCALCONSTANTS.options.string.leaderboardType.description)
				.addChoices(...LOCALCONSTANTS.options.string.leaderboardType.choices)
				.setRequired(LOCALCONSTANTS.options.string.leaderboardType.required)),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			const leaderboardType = interaction.options.getString(LOCALCONSTANTS.options.string.leaderboardType.name);
			const leetcodeUserStatList = await getLeaderboard(interaction.guild.id);
			const leaderboardBarChartData = leaderboardType === LOCALCONSTANTS.options.string.leaderboardType.choices[0].value ?
				formulateDifficultySegregatedLeaderboardBarChartData(leetcodeUserStatList) :
				formulateLeaderboardBarChartData(leetcodeUserStatList);
			const leaderboardBarChartURL = createBarChartURL(leaderboardBarChartData);
			await interaction.editReply(leaderboardBarChartURL);
		}
		catch {
			console.log('Error in fetching leaderboard.');
			await interaction.editReply('Error fetching leaderboard.');
		}
	},
};
