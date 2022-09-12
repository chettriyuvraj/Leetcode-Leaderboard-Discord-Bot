const path = require('node:path');
const Sequelize = require('sequelize');
const CONSTANTS = require(path.join(__dirname, '..', 'constants'));
const LOCALCONSTANTS = CONSTANTS.sequelize;
const { syncTable } = require(path.join(__dirname, 'syncTable'));
const { sequelizeDbPassword, sequelizeDbUsername, dbName } = require(path.join(__dirname, '..', 'config.json'));
const sequelize = new Sequelize(`postgres://${sequelizeDbUsername}:${sequelizeDbPassword}@localhost/${dbName}`, LOCALCONSTANTS.config);

const connect = async () => {
	try {
		await sequelize.authenticate();
		console.log('Successfully connected.');
	}
	catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

const findOrCreateQuestionSolvedTable = async () => {
	return await sequelize.define(LOCALCONSTANTS.tables.questionSolvedData.name, LOCALCONSTANTS.tables.questionSolvedData.definition, LOCALCONSTANTS.tables.questionSolvedData.options);

};


const findOrCreateUserTable = async () => {
	return await sequelize.define(LOCALCONSTANTS.tables.registeredUserData.name, LOCALCONSTANTS.tables.registeredUserData.definition, LOCALCONSTANTS.tables.registeredUserData.options);
};

const connectAndReturnAllTables = async () => {
	await connect();
	const userTable = await findOrCreateUserTable();
	await syncTable(userTable);
	const questionSolvedTable = await findOrCreateQuestionSolvedTable();
	await syncTable(questionSolvedTable);
	return { userTable, questionSolvedTable };
};

module.exports = {
	connect,
	findOrCreateQuestionSolvedTable,
	findOrCreateUserTable,
	connectAndReturnAllTables,
	sequelize,
};