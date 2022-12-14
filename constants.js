const Sequelize = require('sequelize');

module.exports = {
	/* One parent key for each folder + errors */
	errors: {
		SequelizeUniqueConstraintError: 'SequelizeUniqueConstraintError',
		NoSuchUserExistsError: 'NoSuchUserExistsError',
		LeetcodeAPIError: 'LeetcodeAPIError',
		DuplicateUserError: 'DuplicateUserError',
	},
	events: {
		interactionCreate: {
			name: 'interactionCreate',
		},
	},
	commands: {
		register: {
			name: 'register',
			description: 'Register yourself for the Leetcode leaderboard!',
			options: {
				string: {
					leetcodeUsername: {
						name: 'leetcode_username',
						description: 'Your leetcode username',
						required: true,
					},
				},
			},
		},
		leaderboard: {
			name: 'leaderboard',
			description: 'Check out the Leetcode leaderboard for this server (no. of problems solved after registration)!',
			options: {
				string: {
					leaderboardType: {
						name: 'leaderboard_type',
						description: 'Type of leaderboard you want to see',
						required: true,
						choices: [
							{ name: 'Detailed Leaderboard', value: 'detailed' },
							{ name: 'Overall leaderboard', value : 'overall' },
						],
					},
				},
			},
		},
		deregister: {
			name: 'de-register',
			description: 'De-register yourself from the Leetcode leaderboard :(',
			options: {
				string: {
					leetcodeUsername: {
						name: 'leetcode_username',
						description: 'Your leetcode username',
						required: true,
					},
				},
			},
		},
	},
	connection: {
		leetcodeAPI: {
			endpoint: 'https://leetcode.com/graphql',
			headers: {
				'content-type': 'application/json',
			},
			graphqlQuery: {
				'query': 'query getUserProfile($username: String!) { matchedUser(username: $username) { username submitStats: submitStatsGlobal { acSubmissionNum { difficulty count submissions } } } }',
				/* Variables to be included at source */
			},
			method: 'post',
		},
	},
	sequelize: {
		config: {
			host: 'localhost',
			dialect: 'postgres',
			logging: false,
		},
		leaderboard: {
			leaderboardSqlQuery: `SELECT 
			question_solved_data.leetcode_username,
			MAX(easy_solved) - MIN(easy_solved) AS easy_solved,
			MAX(medium_solved) - MIN(medium_solved) AS medium_solved,
			MAX(hard_solved) - MIN(hard_solved) AS hard_solved,
			MAX(total_solved) - MIN(total_solved) AS total_solved
			FROM question_solved_data WHERE question_solved_data.leetcode_username IN (:guildLeetcodeUsernames)
			GROUP BY question_solved_data.leetcode_username
			ORDER BY total_solved DESC`,

		},
		tables: {
			questionSolvedData: {
				name: 'question_solved_data',
				definition: {
					leetcode_username: {
						type: Sequelize.STRING(100),
						allowNull: false,
						unique: false,
					},
					easy_solved: Sequelize.INTEGER,
					medium_solved : Sequelize.INTEGER,
					hard_solved : Sequelize.INTEGER,
					total_solved: Sequelize.INTEGER,
				},
				options: {
					timestamps: true,
					createdAt: 'fetchedAt',
					updatedAt: false,
					freezeTableName: true,
				},
			},
			registeredUserData: {
				name: 'registered_user_data',
				definition: {
					leetcode_username: {
						type: Sequelize.STRING(100),
						allowNull: false,
						primaryKey: true,
					},
					discord_username: {
						type: Sequelize.STRING(100),
						allowNull: false,
						unique: false,
					},
					discord_tag: {
						type: Sequelize.INTEGER,
						allowNull: false,
						unique: false,
					},
					discord_id: {
						type: Sequelize.BIGINT,
						allowNull: false,
						primaryKey: true,
					},
					guild_id: {
						type: Sequelize.BIGINT,
						allowNull: false,
						primaryKey: true,
					},
				},
				options: {
					timestamps: true,
					updatedAt: false,
					freezeTableName: true,
				},
			},
		},
	},
};