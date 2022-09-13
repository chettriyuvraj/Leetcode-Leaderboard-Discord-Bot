const path = require('node:path');
const { NoSuchUserExistsError } = require(path.join(__dirname, '..', 'helpers', 'errors'));

const deleteUser = async (leetcodeUsername, discordId, guildId, userTable, questionSolvedTable) => {
	const user = await userTable.findOne({ where: {
		leetcode_username: leetcodeUsername,
		discord_id: discordId,
		guild_id: guildId } });
	if (user) {
		await userTable.destroy({ where: {
			leetcode_username: leetcodeUsername,
			discord_id: discordId,
			guild_id: guildId } });
		const sameLeetcodeUserInDifferentChannel = await userTable.findOne({ where: {
			leetcode_username: leetcodeUsername } });
		if (!sameLeetcodeUserInDifferentChannel) {
			await questionSolvedTable.destroy({ where: {
				leetcode_username: leetcodeUsername } });
		}
	}
	else {
		throw new NoSuchUserExistsError('No such Leetcode username associated with this Discord ID exists! P.S You cannot de-register usernames registered by others ;)');
	}
};

module.exports = {
	deleteUser,
};
