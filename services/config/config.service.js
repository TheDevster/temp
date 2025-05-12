'use strict';
const _ = require('lodash');
const { HTTP_METHODS, RULES, MOLECULAR_HTTP_CLIENT, API_RETURN_FORMAT, MCP_APIS } = require('../../config/api.constants');

module.exports = {
	name: 'config',
	version: 1,
	settings: {},
	dependencies: [],
	mixins: [],
	hooks: {},
	actions: {
		getProviderConfig: {
			scope: ['config.getProviderConfig'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/getProviderConfig',
			},
			cache: false,
			params: {
				authToken: { type: 'string', required: true },
			},
			async handler(ctx) {
				try {
					let response = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: RULES.BASE_URL + RULES.GET_CONFIG,
						opt: {
							headers: { authorization: ctx.params.authToken },
							responseType: API_RETURN_FORMAT.JSON,
						},
					});
					return response[0].provider_config;
				} catch (error) {
					return error;
				}
			},
		},
		getCustomerConfig: {
			scope: ['config.getCustomerConfig'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/getCustomerConfig',
			},
			cache: false,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
			},
			async handler(ctx) {
				try {
					const { customerName } = ctx.params;

					const paramResponse = await ctx.call('v1.param.get', { withDecryption: 'true' });

					const customerCredentials = paramResponse[customerName];

					if (!customerCredentials) {
						throw new Error(`Customer '${customerName}' not found.`);
					}
					const { userName, password } = customerCredentials;
					if (!userName || !password) {
						throw new Error(`Customer '${customerName}' has invalid details.`);
					}
					const authResponse = await ctx.call('v1.authentication.login', {
						customerName: customerName,
						userName: userName,
						password: password,
					});
					const clientConfigResponse = await ctx.call('v1.config.getProviderConfig', {
						authToken: authResponse.auth_token,
					});
					let mcpConfig = clientConfigResponse.adtran_mcp;

					if (mcpConfig) {
						let response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
							url: mcpConfig.baseUrl + MCP_APIS.REQUEST_AUTH_TOKEN,
							opt: {
								responseType: API_RETURN_FORMAT.JSON,
								body: JSON.stringify({
									username: mcpConfig.userName,
									password: mcpConfig.password,
								}),
							},
						});
						mcpConfig = {
							...mcpConfig,
							authToken: response.token,
						};
					}
					return mcpConfig;
				} catch (error) {
					return error;
				}
			},
		},
	},
	events: {},
	methods: {},
};
