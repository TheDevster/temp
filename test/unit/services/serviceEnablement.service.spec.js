const { ServiceBroker } = require('moleculer');
const { throwError } = require('helper-module');
const ServiceEnablementService = require('../../../services/serviceEnablement/serviceEnablement.service');

// Mock the dependencies
jest.mock('helper-module', () => ({
	throwError: jest.fn(),
}));
jest.mock('../../../helpers/utility.js', () => ({
	errMessageParser: jest.fn(),
	keysToKebabCase: jest.fn(),
}));

describe('Service Enablement Service', () => {
	let broker;
	const mockResponse = {
		output: {
			timestamp: '2025-05-05T04:03:58.215366',
			'service-id': '1671718048-Data',
			status: 'creating',
			'trans-id': '8c51750d-3e7a-4186-92c4-ab3bf5e1d226',
			'completion-status': 'in-progress',
		},
	};
	beforeEach(async () => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(ServiceEnablementService);

		// Mock external API call response
		broker.createService({
			name: 'v1.http',
			actions: {
				post() {
					return mockResponse;
				},
				patch() {
					return {
						success: true,
					};
				},
				get() {
					return {
						success: true,
					};
				},
			},
		});
		broker.createService({
			name: 'v1.config',
			actions: {
				getCustomerConfig() {
					return {
						baseUrl: 'https://api.test.com',
						apiVersion: 'v1',
						authToken: 'mock-token',
					};
				},
			},
		});
		await broker.start();
	});

	afterEach(async () => {
		await broker.stop();
		jest.clearAllMocks();
	});
	describe('Create Service', () => {
		const params = {
			customerName: 'mock-customer',
			serviceDetails: {
				input: {
					serviceContext: {
						serviceId: '167175567-Data',
						serviceType: 'static-ip-service',
						subscriberId: 'subscriber-1',
						remoteId: '167175567',
						agentCircuitId: '',
						profileName: 'Data - 1G Rate with DHCP Subscriber',
						objectParameters: {
							sipIdentity: '',
							sipUserName: '',
							sipPassword: '',
						},
						uplinkEndpoint: {
							interfaceEndpoint: {
								contentProviderName: 'Content Provider',
								outerTagVlanId: 'DATA',
								innerTagVlanId: 'none',
							},
						},
						downlinkEndpoint: {
							interfaceEndpoint: {
								interfaceName: 'OLT-Sim1-g1',
								outerTagVlanId: 'untagged',
								innerTagVlanId: 'none',
							},
						},
					},
				},
			},
		};
		afterEach(async () => {
			jest.clearAllMocks();
		});

		it('should make an API call with correct parameters and return response', async () => {
			const response = await broker.call('v1.services.createService', params);
			expect(response).toEqual({
				success: true,
			});
		});
		it('should handle parameters validation errors thrown in the createService action', async () => {
			await expect(broker.call('v1.services.createService', {})).rejects.toThrow(
				new Error('Parameters validation error!'),
			);
		});
		it('should handle errors properly', async () => {
			const mockError = new Error('MOCK-ERROR');
			const ctx = {
				call: jest.fn(),
				params: params,
			};
			ctx.call.mockRejectedValueOnce(mockError);

			await ServiceEnablementService.actions.createService.handler(ctx);

			expect(throwError).toHaveBeenCalledTimes(1);
			expect(throwError).toHaveBeenCalledWith({ ctx, err: mockError });
		});
	});
	describe('Suspend Service', () => {
		const params = {
			customerName: 'mock-customer',
			serviceDetails: {
				input: {
					serviceContext: {
						serviceId: 'mock-service-id',
					},
				},
			},
		};

		afterEach(async () => {
			jest.clearAllMocks();
		});

		it('should make an API call with correct parameters and return response', async () => {
			const response = await broker.call('v1.services.suspendService', params);
			expect(response).toEqual({
				success: true,
			});
		});
		it('should handle parameters validation errors thrown in the suspendService action', async () => {
			await expect(broker.call('v1.services.suspendService', {})).rejects.toThrow(
				new Error('Parameters validation error!'),
			);
		});
		it('should handle errors properly', async () => {
			const mockError = new Error('MOCK-ERROR');
			const ctx = {
				call: jest.fn(),
				params: params,
			};
			ctx.call.mockRejectedValueOnce(mockError);

			await ServiceEnablementService.actions.suspendService.handler(ctx);

			expect(throwError).toHaveBeenCalledTimes(1);
			expect(throwError).toHaveBeenCalledWith({ ctx, err: mockError });
		});
	});
	describe('Delete Service', () => {
		const params = {
			customerName: 'mock-customer',
			serviceDetails: {
				input: {
					serviceContext: {
						serviceId: 'mock-service-id',
					},
				},
			},
		};

		afterEach(async () => {
			jest.clearAllMocks();
		});

		it('should make an API call with correct parameters and return response', async () => {
			const response = await broker.call('v1.services.deleteService', params);
			expect(response).toEqual({
				success: true,
			});
		});
		it('should handle parameters validation errors thrown in the deleteService action', async () => {
			await expect(broker.call('v1.services.deleteService', {})).rejects.toThrow(
				new Error('Parameters validation error!'),
			);
		});
		it('should handle errors properly', async () => {
			const mockError = new Error('MOCK-ERROR');
			const ctx = {
				call: jest.fn(),
				params: params,
			};
			ctx.call.mockRejectedValueOnce(mockError);

			await ServiceEnablementService.actions.deleteService.handler(ctx);

			expect(throwError).toHaveBeenCalledTimes(1);
			expect(throwError).toHaveBeenCalledWith({ ctx, err: mockError });
		});
	});
	describe('Resume Service', () => {
		const params = {
			customerName: 'mock-customer',
			serviceDetails: {
				input: {
					serviceContext: {
						serviceId: 'mock-service-id',
					},
				},
			},
		};

		afterEach(async () => {
			jest.clearAllMocks();
		});

		it('should make an API call with correct parameters and return response', async () => {
			const response = await broker.call('v1.services.resumeService', params);
			expect(response).toEqual({
				success: true,
			});
		});
		it('should handle parameters validation errors thrown in the resumeService action', async () => {
			await expect(broker.call('v1.services.resumeService', {})).rejects.toThrow(
				new Error('Parameters validation error!'),
			);
		});
		it('should handle errors properly', async () => {
			const mockError = new Error('MOCK-ERROR');
			const ctx = {
				call: jest.fn(),
				params: params,
			};
			ctx.call.mockRejectedValueOnce(mockError);

			await ServiceEnablementService.actions.resumeService.handler(ctx);

			expect(throwError).toHaveBeenCalledTimes(1);
			expect(throwError).toHaveBeenCalledWith({ ctx, err: mockError });
		});
	});
	describe('New Profile Vector', () => {
		const params = {
			customerName: 'mock-customer',
			serviceDetails: {
				input: {
					serviceContext: {
						serviceId: 'mock-service-id',
						profileName: 'mock-profile-name',
					},
				},
			},
		};

		afterEach(async () => {
			jest.clearAllMocks();
		});

		it('should make an API call with correct parameters and return response', async () => {
			const response = await broker.call('v1.services.newProfileVector', params);
			expect(response).toEqual({ success: true });
		});
		it('should handle parameters validation errors thrown in the newProfileVector action', async () => {
			await expect(broker.call('v1.services.newProfileVector', {})).rejects.toThrow(
				new Error('Parameters validation error!'),
			);
		});
		it('should handle errors properly', async () => {
			const mockError = new Error('MOCK-ERROR');
			const ctx = {
				call: jest.fn(),
				params: params,
			};
			ctx.call.mockRejectedValueOnce(mockError);

			await ServiceEnablementService.actions.newProfileVector.handler(ctx);

			expect(throwError).toHaveBeenCalledTimes(1);
			expect(throwError).toHaveBeenCalledWith({ ctx, err: mockError });
		});
	});
});
