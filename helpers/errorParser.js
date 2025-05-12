const _ = require('lodash');

const errorParser = function (errorObject) {
	return JSON.parse(
		// JSON.stringify(errorObject, ["message", "arguments", "type", "name"])
		JSON.stringify(errorObject, _.pull(Object.getOwnPropertyNames(errorObject), 'stack')),
	);
};
module.exports = {
	errorParser,
};
