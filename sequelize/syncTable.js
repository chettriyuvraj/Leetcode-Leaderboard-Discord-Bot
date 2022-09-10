const syncTable = async (dbTable) => {
	try {
		await dbTable.sync();
		console.log('Synced table');
	}
	catch {
		console.log('Error while syncing table');
	}

};

module.exports = {
	syncTable,
};