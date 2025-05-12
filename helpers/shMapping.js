const wanDetailsFormatter = async (subscriberStatusData) => {
	let formattedDevice = [];
	let formatedWanInfo = [];
	let formattedQoe = {};
	let formattedIssues = [];
	let wanDetails = {
		details: {},
		wanInfo: {},
		qoeInfo: {},
	};
	let devices = subscriberStatusData['home-network']['devices'];
	devices.forEach((device) => {
		if (!device.extender_id) {
			wanDetails.details = {};
			if (device) {
				wanDetails.details.hostName = device.hostname;
			}
			wanDetails.details.macAddress = device['mac-address'];
			wanDetails.details.wifiSignalStrength = device['upstream-rssi'];
			wanDetails.details.status = device['oper-state'] == 'up' ? 'online' : 'offline';
			wanDetails.details.model = device['brand'];
			wanDetails.details.manufacturer = '';
			wanDetails.details.codeVersion = '';
			wanDetails.details.connectionType = device['connection-type'];
			wanDetails.details.wifiSNR = '';
			formattedDevice.push(wanDetails.details);
		}
	});
	let wanInfo = subscriberStatusData['home-network']['gateway'];
	// wanInfo.forEach((wan) => {
	wanDetails.wanInfo = {};
	wanDetails.wanInfo.MACAddress = wanInfo['wan-mac'];
	wanDetails.wanInfo.AddressingType = 'NA';
	wanDetails.wanInfo.ConnectionStatus = 'NA';
	wanDetails.wanInfo.ConnectionType = 'NA';
	wanDetails.wanInfo.DNSServers = 'NA';
	wanDetails.wanInfo.ExternalIPAddress = wanInfo['wan-ip'];
	wanDetails.wanInfo.SubnetMask = 'NA';
	wanDetails.wanInfo.DefaultGateway = 'NA';

	formatedWanInfo.push(wanDetails.wanInfo);
	// });

	wanDetails.qoeInfo = {
		avgHomeScore: subscriberStatusData['experience-score'],
		qoeInfo: {
			rawData: [{ qoeScore: '' }],
		},
	};
	formattedQoe = wanDetails.qoeInfo;

	let response = {
		allIssues: formattedIssues,
		wanInfo: formatedWanInfo,
		qoeInfo: formattedQoe,
		details: formattedDevice,
	};

	return response;
};

const subscriberDetailsFormatter = async (subscriber, subscriberDetails) => {
	let routerData = subscriberDetails['home-network']['gateway'];
	let subscriberResponse = {
		subscriberLocationId: '',
		account: subscriber['account-number'],
		name: subscriber['first-name'] + ' ' + subscriber['last-name'],
		firstName: subscriber['first-name'],
		lastName: subscriber['last-name'],
		phone: subscriber['phone-number'],
		email: '',
		customerType: '',
		serviceAddress:
			subscriber['address'] +
			' ' +
			subscriber['city'] +
			' ' +
			subscriber['state'] +
			' ' +
			subscriber['zip-code'] +
			' ' +
			'USA',
		street: subscriber['address'],
		city: subscriber['city'],
		state: subscriber['state'],
		postcode: subscriber['zip-code'],
		country: 'USA',
		lat: 32.9511189,
		lon: -80.6706866,
		billingStatus: 'Active',
		devices: [],
		_id: subscriber['subscriber-id'],
		// devices: ['CXNK011716B8', 'CXNK0093CD9B'],
		deviceData: [
			{
				opMode: 'RG',
				serialNumber: routerData['serial-number'],
				macAddress: routerData['wan-mac'],
				registrationId: '',
				ipAddress: routerData['wan-ip'],
				manufacturer: routerData['vendor'],
				modelName: routerData['part-number'],
				softwareVersion: routerData['software-version'],
				hardwareVersion: routerData['hardware-version'],
				hardwareSerialNumber: '',
				lastInformTime: '',
			},
		],
	};

	let subscriberServices = subscriber['services'];
	let data = {};
	let serviceArray = [];
	subscriberServices.forEach((item) => {
		data = {};
		data.usoc = '';
		data.type = item['service-type'];
		data.customerType = '';
		data.description = subscriber['package-name'];
		data.techType = 'Wireless';
		data.upSpeed = item['provisioned-upstream-rate'];
		data.downSpeed = item['provisioned-downstream-rate'];
		data.endpointMappingOption1 = '';
		data.voiceInterfaces = [];
		data.staticIpConfigurations = [];
		data._id = subscriber['subscriber-id'];
		data.isOntService = false;
		serviceArray.push(data);
	});
	subscriberResponse['services'] = serviceArray;
	return subscriberResponse;
};

const ssidFormatter = async (subscriberData) => {
	let ssid = [];
	let formatResp = [];
	let ssidData = {
		PRConfig: {},
	};
	ssid.map((id) => {
		ssidData.PRConfig = {};
		ssidData.PRConfig.Enable = id && id.enabled ? id.enabled : '';
		ssidData.PRConfig.KeyPassphrase = id && id.Key_passphrase ? id.Key_passphrase : '';
		ssidData.PRConfig.SSID = id && id.ssi ? id.ssid : '';
		formatResp.push(ssidData);
	});
	return formatResp;
};

const routerDetailsFormatter = async (equipment) => {
	let routerData = equipment['home-network']['gateway'];
	let routerDetails = {
		deviceInfo: {},
	};
	if (routerData && routerData.uptime) {
		routerDetails.deviceInfo.uptime = routerData.uptime;
	}
	routerDetails.deviceInfo.hardwareVersion = routerData['hardware-version'];
	routerDetails.deviceInfo.softwareVersion = routerData['software-version'];
	routerDetails.deviceInfo.lastBootTime = routerData['booted-at'];
	routerDetails.deviceInfo.macAddress = routerData['wan-mac'];
	routerDetails.deviceInfo.manufacturer = routerData['vendor'];
	routerDetails.deviceInfo.modelName = routerData['part-number'];
	routerDetails.deviceInfo.serialNumber = routerData['serial-number'];

	return routerDetails;
};

const ontDetailsFormatter = async (ontDetails) => {
	let onuData = ontDetails['access-network']['onu'];
	let reponseOnuData = {
		'onu-mac-addr': ontDetails['home-network']['gateway']['wan-mac'],
		'device-name': onuData['msan-name'],
		'ont-id': onuData['device-id'],
		'serial-number': onuData['serial-number'],
		'oper-status': onuData['oper-state'] == 'up' ? 'present' : 'missing',
		model: onuData['part-number'],
		'up-time': onuData['uptime'],
		'tx-opt-level': onuData['light-levels']['tx'],
		'opt-signal-level': onuData['light-levels']['rx'],
		'mfg-name': 'Adtran',
		'mfg-model-name': onuData['part-number'],
		'mfg-hardware-revision': onuData['firmware-version'],
		'mfg-firmware-revision': onuData['hardware-revision'],
	};
	return reponseOnuData;
};

const BYTES_TO_KILOBYTES_FACTOR = 1024;
const convertMbpsToOctets = (mbps) => {
	const octets = Math.round(mbps * BYTES_TO_KILOBYTES_FACTOR * BYTES_TO_KILOBYTES_FACTOR);
	return octets > 0 ? octets : 0;
};

const convertToUnixTimestamp = (dateString) => {
	const date = new Date(dateString + 'T00:00:00Z'); // Use "Z" to indicate UTC

	// Get the Unix timestamp (in milliseconds)
	const unixTimestamp = Math.floor(date.getTime() / 1000);
	return unixTimestamp;
};

const trafficUsageFormatter = async (trafficData) => {
	let trafficUsageResponse = [];
	let upstreamData = trafficData['upstream-daily-peak'];
	let downstreamData = trafficData['downstream-daily-peak'];
	let data = {};
	upstreamData.forEach((item, index) => {
		data = {};
		data['startPeriodSec'] = convertToUnixTimestamp(item.timestamp);
		data['peakUsRate'] = item['peak-mbps'] ? convertMbpsToOctets(item['peak-mbps']) : null;
		data['peakDsRate'] = downstreamData[index]['peak-mbps']
			? convertMbpsToOctets(downstreamData[index]['peak-mbps'])
			: null;
		trafficUsageResponse.push(data);
		return trafficUsageResponse;
	});
};

module.exports = {
	wanDetailsFormatter,
	subscriberDetailsFormatter,
	ssidFormatter,
	routerDetailsFormatter,
	ontDetailsFormatter,
	trafficUsageFormatter,
};
