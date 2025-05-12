'use strict';
const os = require('os');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: 'system.buildDetails',
	version: 1,

	settings: {},

	dependencies: [],

	actions: {
		getBuildEnvDetails: {
			permModule: 'System - Build Details',
			permAction: 'getBuildEnvDetails',
			permKey: 'system.buildDetails.getBuildEnvDetails',
			permDescription: 'getBuildEnvDetails',
			rest: {
				method: 'GET',
				path: '/getBuildEnvDetails',
			},
			cache: {
				enabled: false,
			},
			params: {},
			async handler(/*ctx*/) {
				return process.env;
			},
		},
		getBuildDetails: {
			permModule: 'System - Build Details',
			permAction: 'getBuildDetails',
			permKey: 'system.buildDetails.getBuildDetails',
			permDescription: 'getBuildDetails',
			rest: {
				method: 'GET',
				path: '/getBuildDetails',
			},
			cache: {
				enabled: false,
			},
			params: {},
			async handler(/*ctx*/) {
				return {
					HOSTANME: os.hostname(),
					UPTIME: os.uptime(),
					UPTIME_TILL_NOW: new Date(os.uptime() * 1000).toISOString().substr(11, 8),
					SVC_CREATED_AT: new Date(process.env.svcCreatedAt).toString(),
					SVC_STARTED_AT: new Date(process.env.svcStartedAt).toString(),
					UPTIME_RELATIVE: formatDistanceToNow(new Date(process.env.svcStartedAt), { addSuffix: true }),
					SVC_CREATED_AT_LOCALE: new Date(process.env.svcCreatedAt).toLocaleString('en-US', {
						timeZone: 'Asia/Kolkata',
					}),
					SVC_STARTED_AT_LOCALE: new Date(process.env.svcStartedAt).toLocaleString('en-US', {
						timeZone: 'Asia/Kolkata',
					}),
					ENV: process.env.ENV,
					LOGLEVEL: process.env.LOGLEVEL,
					NAMESPACE: process.env.NAMESPACE,
				};
			},
		},
	},

	events: {},

	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		process.env.svcCreatedAt = new Date().toJSON();
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		process.env.svcStartedAt = new Date().toJSON();
	},
};
