const path = require('node:path');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.sequelize.leaderboard;
const { sequelize, connectAndReturnAllTables } = require(path.join(__dirname, 'sequelize'));

const getLeaderboard = async (guildId) => {
	const { userTable } = await connectAndReturnAllTables();
	const allGuildUsers = await userTable.findAll({ where:{ guild_id: guildId } });
	const guildLeetcodeUsernames = allGuildUsers.map(user => user.leetcode_username);
	const [result] = await sequelize.query(LOCALCONSTANTS.leaderboardSqlQuery, { replacements: { guildLeetcodeUsernames } });
	return result;
};

module.exports = {
	getLeaderboard,
};