class NoSuchUserExistsError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NoSuchUserExistsError';
	}
}

module.exports = {
	NoSuchUserExistsError,
};

