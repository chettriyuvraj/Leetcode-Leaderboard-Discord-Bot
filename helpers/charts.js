const formulateDifficultySegregatedLeaderboardBarChartData = (leetcodeUserStatList) => {
	const labels = [];
	const datasets = [ { label:'Easy', data:[] },
		{ label:'Medium', data:[] },
		{ label:'Hard', data:[] },
	];
	for (const userStat of leetcodeUserStatList) {
		labels.push(userStat.leetcode_username);
		datasets[0].data.push(userStat.easy_solved);
		datasets[1].data.push(userStat.medium_solved);
		datasets[2].data.push(userStat.hard_solved);
	}
	return { labels, datasets };
};

const formulateLeaderboardBarChartData = (leetcodeUserStatList) => {
	const labels = [];
	const datasets = [ { label:'Total Solved', data:[] } ];
	for (const userStat of leetcodeUserStatList) {
		labels.push(userStat.leetcode_username);
		datasets[0].data.push(userStat.total_solved);
	}
	return { labels, datasets };
};


module.exports = {
	formulateDifficultySegregatedLeaderboardBarChartData,
	formulateLeaderboardBarChartData,
};