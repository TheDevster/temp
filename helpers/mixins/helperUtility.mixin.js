const { Error } = require('../errors.js');
const { errorParser } = require('../errorParser.js');

module.exports = {
	methods: {
		responseFormatter(successMessage, object) {
			return {
				success: true,
				message: successMessage,
				data: object ? object : {},
			};
		},
		errorParser,
		throwError(msg, code, type, data = {}, errorObject) {
			if (errorObject) {
				data.errorObject = errorParser(errorObject);
			}
			throw new Error(msg, code, type, data);
		},
	},
};
