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

class DuplicateUserError extends Error {
	constructor(message) {
		super(message);
		this.name = 'DuplicateUserError';
	}
}

module.exports = {
	NoSuchUserExistsError,
	LeetcodeAPIError,
	DuplicateUserError,
};

