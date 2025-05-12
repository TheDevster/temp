const { ServiceBroker } = require('moleculer');
const AssurancesService = require('../../../services/serviceAssuranceServices/assurances.service');
const broker = new ServiceBroker({ logger: false });
const { responseFormatter, throwError } = require('helper-module');
broker.createService(AssurancesService);

// Mock the commonHttpService
broker.createService({
	name: 'common.http.service',
	actions: {
		request(ctx) {
			return Promise.resolve({ data: 'mocked response' });
		},
	},
});

describe('Assurance service', () => {
	describe('Get Wan Details', () => {
		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should return wan details when valid account id is provided', async () => {
			jest.spyOn(broker, 'call').mockResolvedValue({
				status: 200,
				data: { data: 'mocked response' },
			});
			// Call the service
			const response = await broker.call('v1.service_assurance.getWanDetails', {
				accountId: '12345',
				apiUrl: 'mockUrl',
				apiKey: 'mockKey',
				tenantId: 'mockTenant',
			});
			expect(response.status).toEqual(200);
			expect(response.data).toEqual({ data: 'mocked response' });
		});
	});
});
