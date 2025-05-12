const Openapi = require('moleculer-auto-openapi');

module.exports = {
	name: 'openapi',
	mixins: [Openapi],
	settings: {
		// all setting optional
		openapi: {
			info: {
				// about project
				description: 'Adtran Adapter MCP API Documentation',
				title: 'Adapter Adtran MCP',
			},
			tags: [
				// you tags
				// { name: "auth", description: "My custom name" }
			],
			components: {
				// you auth
				securitySchemes: {
					myBasicAuth: {
						type: 'http',
						scheme: 'basic',
					},
				},
			},
		},
	},
};
