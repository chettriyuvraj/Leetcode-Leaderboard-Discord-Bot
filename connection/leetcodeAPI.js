const axios = require('axios');
const path = require('node:path');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.connection.leetcodeAPI;
const { createEntry } = require(path.join(__dirname, '..', 'sequelize', 'createEntry'));
const { connectAndReturnAllTables } = require(path.join(__dirname, '..', 'sequelize', 'sequelize'));
const { LeetcodeAPIError } = require(path.join(__dirname, '..', 'helpers', 'errors'));

async function getUserLeetcodeStats(username) {
	const { endpoint, headers, method } = LOCALCONSTANTS;
	const graphqlQuery = { ...LOCALCONSTANTS.graphqlQuery, variables: { username } };
	try {
		const response = await axios({
			url: endpoint,
			method,
			headers,
			data: graphqlQuery,
		});
		const [all, easy, medium, hard] = parseUserLeetcodeStats(response);
		return { all, easy, medium, hard };
	}
	catch (error) {
		console.error('Error while calling graphQL Leetcode API!');
		throw new LeetcodeAPIError('Error connecting to Leetcode API. Please try again in sometime.');
	}
}

const updateAllUsersLeetcodeStats = async () => {
	try {
		const { userTable, questionSolvedTable } = await connectAndReturnAllTables();
		const allUsersDataObjList = await userTable.findAll();
		const uniqueLeetcodeUsernames = [...new Set(allUsersDataObjList.map(userDataObj => userDataObj.leetcode_username))];
		for (const leetcode_username of uniqueLeetcodeUsernames) {
			const userStats = await getUserLeetcodeStats(leetcode_username);
			await createEntry(questionSolvedTable, {
				leetcode_username,
				easy_solved: userStats.easy.count,
				medium_solved: userStats.medium.count,
				hard_solved: userStats.hard.count,
				total_solved: userStats.all.count,
			});
		}
	}
	catch {
		console.log('Error while updating user stats!');
	}
};

const parseUserLeetcodeStats = (leetcodeAPIResponse) => {
	return leetcodeAPIResponse.data.data.matchedUser.submitStats.acSubmissionNum;
};


module.exports = {
	getUserLeetcodeStats,
	updateAllUsersLeetcodeStats,
};
