const axios = require('axios');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
	name: 'common.http.service',
	actions: {
		// Universal HTTP request handler
		request: {
			params: {
				method: {
					type: 'string',
					enum: ['GET', 'POST', 'PUT', 'DELETE'],
				}, // HTTP methods
				url: { type: 'string' }, // URL of the API
				headers: { type: 'object', optional: true }, // Optional headers
				data: { type: 'object', optional: true }, // Optional data for POST/PUT requests
				timeout: { type: 'number', optional: true }, // Add timeout parameter
			},
			async handler(ctx) {
				const { method, url, headers, data, timeout } = ctx.params;
				try {
					const options = {
						method,
						url,
						headers: headers || {}, // Use headers if provided
						data: data || undefined, // Use data if provided (for POST/PUT)
						timeout: timeout || 5000000, // Default timeout is 20000ms (20seconds)
					};
					// Use axios to perform the HTTP request
					const response = await axios(options);
					return response.data; // Return the response data
				} catch (err) {
					throw new MoleculerClientError('HTTP request failed', 500, 'HTTP_ERROR', { error: err.message });
				}
			},
		},
	},
};
