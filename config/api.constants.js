module.exports = {
	HTTP_METHODS: {
		GET: 'GET',
		PUT: 'PUT',
		POST: 'POST',
		DELETE: 'DELETE',
	},
	COMMON_HTTP_REQUEST: 'common.http.service.request',

	SERVICE_ASSURANCE_APIS: {
		SUBSCRIBER_DETAILS: '/subscribers/account-number={%ACCOUNT_ID%}',
		GET_SUBSCRIBER_STATUS: '/subscribers/account-number={%ACCOUNT_ID%}/status/service={%SERVICE_INDEX%}',
		GET_TRAFFIC_USAGE: '/subscribers/account-number={%ACCOUNT_ID%}}/service={%SERVICE_INDEX%}/peak-bandwidth',
		REBOOT_ROUTER: '/subscribers/account-number={%ACCOUNT_ID%}/service={%SERVICE_INDEX%}/reboot-rg',
		REBOOT_ONT: '/subscribers/account-number={%ACCOUNT_ID%}/service={%SERVICE_INDEX%}/reboot-circuit',
	},

	ADTRAN_REQUEST_HEADERS: {
		TENANT_ID: 'X-Tenant-ID',
		API_KEY: 'X-API-Key',
	},
	MOLECULAR_HTTP_CLIENT: {
		GET: 'v1.http.get',
		PUT: 'v1.http.put',
		POST: 'v1.http.post',
		DELETE: 'v1.http.delete',
		PATCH: 'v1.http.patch',
	},
	API_RETURN_FORMAT: {
		JSON: 'json',
	},
	DEFAULT_HEADER: (authorization) => {
		return {
			Authorization: authorization,
			'Content-Type': 'application/json',
		};
	},
	MCP_APIS: {
		GET_URL: (baseUrl, endPoint) => `${baseUrl}${endPoint}`,
		CREATE_SERVICE: '/api/restconf/operations/adtran-cloud-platform-orchestration:create',
		REMOVE_SUBSCRIBER: '/api/restconf/operations/adtran-cloud-platform-orchestration:delete',
		SUSPEND_SERVICE: '/api/restconf/operations/adtran-cloud-platform-uiworkflow:suspend',
		RESUME_SERVICE: '/api/restconf/operations/adtran-cloud-platform-uiworkflow:resume',
		MODIFY_SERVICE: '/api/restconf/operations/adtran-cloud-platform-orchestration:modify',
		DELETE_SERVICE: '/api/restconf/operations/adtran-cloud-platform-orchestration:delete',
		ACTIVATE_SERVICE: '/api/restconf/operations/adtran-cloud-platform-uiworkflow:activate',
		REQUEST_AUTH_TOKEN: '/api/restconf/operations/adtran-auth-token:request-token',
		ORCHESTRATION_TRANSITIONS: '/api/restconf/data/adtran-cloud-platform-orchestration:transitions',
		UI_WORKFLOW_TRANSITIONS: '/api/restconf/data/adtran-cloud-platform-uiworkflow:transitions',
		DEACTIVATE_SERVICE: '/api/restconf/operations/adtran-cloud-platform-uiworkflow:deactivate',
	},
	RULES: {
		BASE_URL: `${process.env.RULES_BASE_URL + 'api/' + process.env.RULES_API_VERSION}/`,
		GET_CONFIG: 'dynamodb/client/config/get',
	},
	AUTH: {
		BASE_URL: `${process.env.AUTH_BASE_URL + process.env.AUTH__API_VERSION}/`,
		LOGIN: 'auth/login',
	},
};
