'use strict';
const { throwError } = require('helper-module');
const { errMessageParser, keysToKebabCase } = require('../../helpers/utility');
const {
	HTTP_METHODS,
	MOLECULAR_HTTP_CLIENT,
	DEFAULT_HEADER,
	MCP_APIS,
	API_RETURN_FORMAT,
} = require('../../config/api.constants');
const { PARAMS_FIELD_DESCRIPTION } = require('../../config/constants');

module.exports = {
	name: 'services',
	version: 1,
	settings: {},
	dependencies: [],
	mixins: [],
	hooks: {},
	actions: {
		createService: {
			scope: ['services.createService'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/createService',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											max: 250,
											required: true,
											empty: false,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
										serviceType: {
											type: 'string',
											max: 250,
											required: true,
											empty: false,
											default: 'static-ip-service',
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_TYPE,
										},
										subscriberId: {
											type: 'string',
											required: true,
											empty: false,
										},
										remoteId: {
											type: 'string',
											optional: true,
											$$t: PARAMS_FIELD_DESCRIPTION.REMOTE_ID,
										},
										agentCircuitId: {
											type: 'string',
											optional: true,
											$$t: PARAMS_FIELD_DESCRIPTION.AGENT_CIRCUIT_ID,
										},
										profileName: {
											type: 'string',
											optional: true,
											$$t: PARAMS_FIELD_DESCRIPTION.PROFILE_NAME,
										},
										objectParameters: {
											type: 'object',
											optional: true,
											empty: true,
											props: {
												sipIdentity: {
													type: 'string',
													optional: true,
												},
												sipUserName: {
													type: 'string',
													optional: true,
												},
												sipPassword: {
													type: 'string',
													optional: true,
												},
											},
										},
										uplinkEndpoint: {
											type: 'object',
											optional: true,
											$$t: PARAMS_FIELD_DESCRIPTION.UP_LINK_ENDPOINT,

											props: {
												interfaceEndpoint: {
													type: 'object',
													optional: true,
													$$t: PARAMS_FIELD_DESCRIPTION.INTERFACE_ENDPOINT,

													props: {
														contentProviderName: {
															type: 'string',
															required: true,
															empty: false,
															$$t: PARAMS_FIELD_DESCRIPTION.CONTENT_PROVIDER,
														},
														outerTagVlanId: {
															type: 'any',
															default: 'untagged',
															required: true,
															empty: false,
															$$t: PARAMS_FIELD_DESCRIPTION.OUTER_TAG_VLAN_ID,
														},
														innerTagVlanId: {
															type: 'any',
															optional: true,
															default: 'none',
															$$t: PARAMS_FIELD_DESCRIPTION.INNER_TAG_VLAN_ID,
														},
													},
												},
											},
										},
										downlinkEndpoint: {
											type: 'object',
											optional: true,
											$$t: PARAMS_FIELD_DESCRIPTION.DOWN_LINK_ENDPOINT,

											props: {
												interfaceEndpoint: {
													type: 'object',
													optional: true,
													props: {
														interfaceName: {
															type: 'string',
															required: true,
															empty: false,
															$$t: PARAMS_FIELD_DESCRIPTION.INTERFACE_NAME,
														},
														outerTagVlanId: {
															type: 'any',
															default: 'untagged',
															required: true,
															empty: false,
															$$t: PARAMS_FIELD_DESCRIPTION.OUTER_TAG_VLAN_ID,
														},
														innerTagVlanId: {
															type: 'any',
															optional: true,
															default: 'none',
															empty: false,
															$$t: PARAMS_FIELD_DESCRIPTION.INNER_TAG_VLAN_ID,
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);
					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.CREATE_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		suspendService: {
			scope: ['services.suspendService'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/suspendService',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.SUSPEND_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		resumeService: {
			scope: ['services.resumeService'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/resumeService',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.RESUME_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		deleteService: {
			scope: ['services.deleteService'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/deleteService',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.DELETE_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		newProfileVector: {
			scope: ['services.newProfileVector'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/newProfileVector',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					required: true,
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
										profileName: {
											type: 'string',
											empty: false,
											$$t: PARAMS_FIELD_DESCRIPTION.PROFILE_NAME,
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.MODIFY_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		createNewCustomerParameters: {
			scope: ['services.createNewCustomerParameters'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/createNewCustomerParameters',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
										profileName: {
											type: 'string',
											$$t: PARAMS_FIELD_DESCRIPTION.PROFILE_NAME,
										},
										customParameter: {
											type: 'object',
											required: true,
											empty: false,
											props: {
												name: {
													type: 'string',
													empty: false,
												},
												value: {
													type: 'string',
													empty: false,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.MODIFY_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		activateService: {
			scope: ['services.activateService'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/activateService',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.ACTIVATE_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		deactivateService: {
			scope: ['services.deactivateService'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/deactivateService',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				serviceDetails: {
					type: 'object',
					empty: false,
					props: {
						input: {
							type: 'object',
							required: true,
							empty: false,
							props: {
								serviceContext: {
									type: 'object',
									required: true,
									empty: false,
									props: {
										serviceId: {
											type: 'string',
											empty: false,
											max: 250,
											$$t: PARAMS_FIELD_DESCRIPTION.SERVICE_ID,
										},
									},
								},
							},
						},
					},
				},
			},
			async handler(ctx) {
				try {
					const { customerName, serviceDetails } = ctx.params;
					const requestBody = keysToKebabCase(serviceDetails);

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.POST, {
						url: MCP_APIS.GET_URL(configResponse.baseUrl, MCP_APIS.DEACTIVATE_SERVICE),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							body: JSON.stringify(requestBody),
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					const transitionId = response.output['trans-id'];
					const transitionResponse = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return transitionResponse;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		getOrchestrationTransitions: {
			scope: ['services.getOrchestrationTransitions'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/getOrchestrationTransitions',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				transitionId: { type: 'string', empty: false },
			},
			async handler(ctx) {
				try {
					const { transitionId, customerName } = ctx.params;

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.ORCHESTRATION_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return response;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
		getUiWorkflowTransitions: {
			scope: ['services.getUiWorkflowTransitions'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/getUiWorkflowTransitions',
			},
			cache: false,
			timeout: 45 * 1000,
			params: {
				$$strict: true,
				customerName: { type: 'string', empty: false },
				transitionId: { type: 'string', empty: false },
			},
			async handler(ctx) {
				try {
					const { transitionId, customerName } = ctx.params;

					const configResponse = await ctx.call('v1.config.getCustomerConfig', {
						customerName: customerName,
					});
					const response = await ctx.call(MOLECULAR_HTTP_CLIENT.GET, {
						url: MCP_APIS.GET_URL(
							configResponse.baseUrl,
							MCP_APIS.UI_WORKFLOW_TRANSITIONS + '/transition=' + transitionId,
						),
						opt: {
							responseType: API_RETURN_FORMAT.JSON,
							headers: DEFAULT_HEADER(configResponse.authToken),
						},
					});
					return response;
				} catch (error) {
					return throwError({ ctx: ctx, err: error, msg: errMessageParser(ctx) });
				}
			},
		},
	},
	events: {},
	methods: {},
};
