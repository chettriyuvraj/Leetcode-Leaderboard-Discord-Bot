const QuickChart = require('quickchart-js');

/*
 * Returns URL with static bar chart - data in chart.js format
 */
const createBarChartURL = (data) => {
	const myChart = new QuickChart();
	myChart.setConfig({
		type: 'bar',
		data,
	});
	return myChart.getUrl();
};

module.exports = {
	createBarChartURL,
};