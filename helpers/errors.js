const { MoleculerError } = require('moleculer').Errors;

class Error extends MoleculerError {
	constructor(msg, code, type, data) {
		super(msg || 'Error', code || 503, type || 'COMMON_ERROR', data);
	}
}

module.exports = {
	Error,
};
