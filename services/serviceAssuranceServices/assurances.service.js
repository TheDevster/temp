'use strict';

const { responseFormatter, throwError } = require('helper-module');
const {
	COMMON_HTTP_REQUEST,
	HTTP_METHODS,
	SERVICE_ASSURANCE_APIS,
	ADTRAN_REQUEST_HEADERS,
} = require('../../config/api.constants');
const moment = require('moment');
const constants = require('../../config/constants');

const {
	wanDetailsFormatter,
	subscriberDetailsFormatter,
	ssidFormatter,
	routerDetailsFormatter,
	ontDetailsFormatter,
	trafficUsageFormatter,
} = require('../../helpers/shMapping');

async function addDataDog(ctx, params) {
	try {
		let payload = {
			level: process.env.LOGLEVEL,
			stack: {
				error: params.error ? JSON.stringify(params.error) : '',
				function: params.functionName,
				message: params.error,
				source: 'assurances.service.js',
			},
			service: process.env.ENV + '-' + process.env.NAMESPACE,
			timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
		};
		const res = await ctx.call(COMMON_HTTP_REQUEST, {
			method: HTTP_METHODS.POST,
			headers: false,
			params: payload,
			url: `${process.env.DATA_DOG_API_URL}${process.env.DATADOG_CLIENT_TOKEN}`,
		});
		return responseFormatter({ ctx, data: res });
	} catch (err) {
		return throwError({ ctx, err });
	}
}

async function getSubscriberById(ctx) {
	try {
		const res = await ctx.call(COMMON_HTTP_REQUEST, {
			method: HTTP_METHODS.GET,
			headers: {
				[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
				[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
			},
			url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.SUBSCRIBER_DETAILS.replace('{%ACCOUNT_ID%}', ctx.params.accountId)}`,
		});
		return responseFormatter({ ctx, data: res });
	} catch (err) {
		await addDataDog(ctx, { functionName: 'getSubscriberById', error: err });
		return throwError({ ctx, err });
	}
}

module.exports = {
	name: 'assurances',
	version: 1,
	actions: {
		getWanDetails: {
			scope: ['serviceAssurance.devices.getWanDetails'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/devices/:accountId/wan-details',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.GET_SUBSCRIBER_STATUS.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						let formattedWanInfo = await wanDetailsFormatter(res);
						return responseFormatter({
							ctx,
							msg: constants.SUCCESS_MESSAGE.GET.replace(/###/g, 'Wan Details'),
							data: formattedWanInfo,
						});
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'getWanDetails', error: err });
					return throwError({ ctx, err });
				}
			},
		},
		getSubscriberDetails: {
			scope: ['serviceAssurance.devices.getSubscriberDetails'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/subscriber/:accountId',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.GET_SUBSCRIBER_STATUS.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						let formattedSubscriberInfo = await subscriberDetailsFormatter(subscriberData, res);
						return responseFormatter({ ctx, data: formattedSubscriberInfo });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'getSubscriberDetails', error: err });
					return throwError({ ctx, err });
				}
			},
		},
		getSSIDInfo: {
			scope: ['serviceAssurance.devices.getSSIDInfo'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/devices/:accountId/ssid-info',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.GET_SUBSCRIBER_STATUS.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						let formattedResponse = await ssidFormatter(res);
						return responseFormatter({ ctx, data: formattedResponse });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'getSSIDInfo', error: err });
					return throwError({ ctx, err });
				}
			},
		},
		getRouterDetails: {
			scope: ['serviceAssurance.devices.getRouterDetails'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/devices/:accountId/router-details',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.GET_SUBSCRIBER_STATUS.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						let formattedResponse = await routerDetailsFormatter(res);
						return responseFormatter({ ctx, data: formattedResponse });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'getRouterDetails', error: err });
					return throwError({ ctx, err });
				}
			},
		},
		getONTDetails: {
			scope: ['serviceAssurance.devices.getONTDetails'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/devices/ont-details/:accountId',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.GET_SUBSCRIBER_STATUS.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						let formattedResponse = await ontDetailsFormatter(res.data);
						return responseFormatter({ ctx, data: formattedResponse });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'getONTDetails', error: err });
					return throwError({ ctx, err });
				}
			},
		},
		rebootRouter: {
			scope: ['serviceAssurance.devices.rebootRouter'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/devices/:accountId/reboot-router',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.REBOOT_ROUTER.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						return responseFormatter({ ctx, data: res });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'rebootRouter', error: err });
					return throwError({ ctx, err });
				}
			},
		},

		rebootONT: {
			scope: ['serviceAssurance.devices.rebootONT'],
			rest: {
				method: HTTP_METHODS.POST,
				path: '/devices/:accountId/reboot-ont',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.REBOOT_ROUTER.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						return responseFormatter({ ctx, data: res });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'rebootRouter', error: err });
					return throwError({ ctx, err });
				}
			},
		},

		getTrafficUsageData: {
			scope: ['serviceAssurance.devices.getTrafficUsageData'],
			rest: {
				method: HTTP_METHODS.GET,
				path: '/devices/:accountId/traffic-usage',
			},
			cache: false,
			params: {
				$$strict: true,
				apiUrl: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				tenantId: { type: 'string', optional: false },
				accountId: { type: 'string', optional: false },
			},
			async handler(ctx) {
				try {
					let subscriberByIdResp = await getSubscriberById(ctx);
					let subscriberData = subscriberByIdResp.data;
					if (subscriberData) {
						let serviceIndex = subscriberData.services[0]['service-id'];
						const res = await ctx.call(COMMON_HTTP_REQUEST, {
							method: HTTP_METHODS.GET,
							headers: {
								[ADTRAN_REQUEST_HEADERS.API_KEY]: ctx.params.apiKey,
								[ADTRAN_REQUEST_HEADERS.TENANT_ID]: ctx.params.tenantId,
							},
							url: `${ctx.params.apiUrl}${SERVICE_ASSURANCE_APIS.GET_TRAFFIC_USAGE.replace('{%ACCOUNT_ID%}', ctx.params.accountId).replace('{%SERVICE_INDEX%}', serviceIndex)}`,
						});
						let formattedResponse = await trafficUsageFormatter(res.data);
						return responseFormatter({ ctx, data: formattedResponse });
					} else {
						return responseFormatter({ ctx, data: subscriberByIdResp });
					}
				} catch (err) {
					await addDataDog(ctx, { functionName: 'getTrafficUsageData', error: err });
					return throwError({ ctx, err });
				}
			},
		},
	},
};
