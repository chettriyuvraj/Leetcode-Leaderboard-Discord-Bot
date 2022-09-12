class NoSuchUserExistsError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NoSuchUserExistsError';
	}
}
class LeetcodeAPIError extends Error {
	constructor(message) {
		super(message);
		this.name = 'LeetcodeAPIError';
	}
}

module.exports = {
	NoSuchUserExistsError,
	LeetcodeAPIError,
};

