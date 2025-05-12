const { MoleculerError } = require('moleculer').Errors;
const { MESSAGES } = require('../config/constants');
const { constantCase } = require('change-case');

const _ = require('lodash');

class AppError extends MoleculerError {
	constructor(msg, code, type, data) {
		super(msg || 'UNKNOWN_ERROR_OCCURED', code || 503, type || 'APP_ERROR', data);
	}
}

const responseFormatter = async ({ ctx, msg, data }) => {
	const { constantCase } = await import('change-case');

	const rtnObj = {
		// success: true,
		message: msg,
		data: data ? data : {},
	};

	if (ctx) {
		rtnObj.message = msg || constantCase(ctx.action.name).concat('_SUCCESS');
		// Log the successful response
		ctx.broker.logger.info('API Success', {
			action: ctx.action.name,
			params: ctx.params,
			response: rtnObj,
		});
	}
	return rtnObj;
};
const errorParser = (errorObject) => {
	return JSON.parse(JSON.stringify(errorObject, _.pull(Object.getOwnPropertyNames(errorObject), 'stack')));
};
const throwError = async ({ ctx, msg, code, type, data, err }) => {
	const { constantCase } = await import('change-case');
	const logger = ctx.broker.logger;

	if (err && err.name === 'AppError') {
		logger.error('AppError occurred', {
			action: ctx.action.name,
			params: ctx.params,
			err: err ? err.message : undefined,
		});
		throw err;
	}

	if (ctx) {
		msg = msg || constantCase(ctx.action.name).concat('_ERROR');
		type = type || ctx.action.name;
		data = data || { params: ctx.params };
		code = code || err?.code || 503;
	}
	if (err) {
		data.errorObject = errorParser(err);
	}
	// Log the error with Winston
	logger.error('API Error', {
		message: msg,
		code: code,
		type: type,
		data: data,
		err: err ? err.message : undefined,
	});
	throw new AppError(msg, code, type, data);
};
const errMessageParser = (ctx) => {
	const actionName = constantCase(ctx.action.name)
		.replace(/^V\d+_/, '')
		.trim()
		.concat('_ERROR');
	return MESSAGES[actionName];
};
const parseBoolean = (value) => {
	if (value === undefined || value === null) return undefined;
	if (typeof value === 'boolean') return value;
	if (typeof value !== 'string') return false;
	const normalizedInput = value.trim().toLowerCase();
	return normalizedInput === 'true'; // Return true for 'true', otherwise false
};
const keysToKebabCase = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map(keysToKebabCase);
	} else if (_.isPlainObject(obj)) {
		return Object.entries(obj).reduce((acc, [key, value]) => {
			const newKey = _.kebabCase(key);
			acc[newKey] = keysToKebabCase(value);
			return acc;
		}, {});
	}
	return obj;
};
module.exports = {
	AppError,
	responseFormatter,
	errorParser,
	throwError,
	errMessageParser,
	parseBoolean,
	keysToKebabCase,
};
