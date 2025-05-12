'use strict';
const _ = require('lodash');
const { HTTP_METHODS } = require('../../config/api.constants');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const { parseBoolean } = require('../../helpers/utility');

module.exports = {
	name: 'param',
	version: 1,
	settings: {},
	dependencies: [],
	mixins: [],
	hooks: {},
	actions: {
		get: {
			scope: ['param.get'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/get',
			},
			cache: false,
			params: {
				// withDecryption: { type: "boolean", required: true, default: true }
				withDecryption: { type: 'enum', optional: true, empty: false, values: ['true', 'false'], default: 'true' },
			},
			async handler(ctx) {
				const isWithDecryption = parseBoolean(ctx.params.withDecryption);
				return await this.getParameter(isWithDecryption);
			},
		},
	},
	events: {},
	methods: {
		async getParameter(withDecryption = true) {
			const client = new SSMClient({ region: process.env.AWS_REGION });
			const command = new GetParameterCommand({
				Name: process.env.AWS_PARAM_STORE_NAME,
				WithDecryption: withDecryption,
			});
			try {
				const response = await client.send(command);
				return JSON.parse(response.Parameter?.Value);
			} catch (error) {
				this.logger.error('Failed to fetch parameter:', error);
				throw new Error(`Parameter fetch failed: ${error.message}`);
			}
		},
	},
};
