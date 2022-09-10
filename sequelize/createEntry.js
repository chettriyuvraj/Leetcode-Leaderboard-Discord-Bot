const createEntry = async (dbTable, entryObj) => {
	try {
		await dbTable.create(entryObj);
	}
	catch (error) {
		console.log('Error while creating entry');
		throw (error);
	}
};

module.exports = {
	createEntry,
};