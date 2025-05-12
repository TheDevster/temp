const HTTPClientService = require('moleculer-http-client');

module.exports = {
	name: 'http',
	version: 1,
	// Load HTTP Client Service
	mixins: [HTTPClientService],
	/**
	 * Moleculer settings
	 */
	settings: {
		// HTTP client settings
		httpClient: {
			// Boolean value indicating whether request should be logged or not
			logging: true,

			// Log request function
			// logOutgoingRequest: logOutgoingRequest,
			// logOutgoingRequest: (request) => {
			// 	console.log('Outgoing Request:', {
			// 		method: request.method,
			// 		url: request.url,
			// 		headers: request.headers,
			// 		body: request.body,
			// 	});
			// },

			// Log response function
			// logIncomingResponse: logIncomingResponse,
			// logIncomingResponse: (response) => {
			// console.log('Incoming Response:', {
			// 	statusCode: response.statusCode,
			// 	headers: response.headers,
			// 	body: response.body,
			// });
			// },

			// Format the Response
			responseFormatter: 'body', // one of "body", "headers", "status", "full", "raw" or a Function. Example: (res) => ({body: res.body, headers: res.headers})

			// Format the Errors
			// errorFormatter: errorFormatter,
			// errorFormatter: (err) => {
			// 	console.error('HTTP Client Error:', {
			// 		message: err.message,
			// 		stack: err.stack,
			// 		code: err.code || 500, // Default to 500 if no code is provided
			// 	});
			// 	return {
			// 		message: err.message,
			// 		stack: err.stack,
			// 		code: err.code || 500, // Default to 500 if no code is provided
			// 	};
			// },

			// Got Client options
			defaultOptions: {
				https: {
					rejectUnauthorized: false,
				},
				responseType: 'json',
				timeout: 60000,
				// Put here any Got available option that can be used to extend Got client
			},
		},
	},
};
