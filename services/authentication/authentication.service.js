'use strict';
const _ = require('lodash');
const { HTTP_METHODS, AUTH, MOLECULAR_HTTP_CLIENT, API_RETURN_FORMAT } = require('../../config/api.constants');

module.exports = {
	name: 'authentication',
	version: 1,
	settings: {},
	dependencies: [],
	mixins: [],
	hooks: {},
	actions: {
		login: {
			scope: ['authentication.login'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/login',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				customerName: { type: 'string', required: true },
				userName: { type: 'string', required: true },
				password: { type: 'string', required: true },
			},
			async handler(ctx) {
				try {
					let response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: AUTH.BASE_URL + AUTH.LOGIN,
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify({
								username: ctx.params.userName,
								password: ctx.params.password,
								customerName: ctx.params.customerName,
							}),
							headers: { 'Content-Type': 'application/json' },
						},
					});
					return response.authenticationResult;
				} catch (error) {
					return error;
				}
			},
		},
	},
	events: {},
	methods: {},
};
