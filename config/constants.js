module.exports = {
	SUCCESS_MESSAGE: {
		GET: '### retrieved successfully',
		CREATE: '### created successfully',
		UPDATE: '### updated successfully',
		DELETE: '### deleted successfully',
	},
	ERROR_MESSAGE: {
		GET: 'Error retrieving ###',
		CREATE: 'Error creating ###',
		UPDATE: 'Error updating ###',
		DELETE: 'Error deleting ###',
	},
	MESSAGES: {},
	PARAMS_FIELD_DESCRIPTION: {
		SERVICE_ID: 'Name of the service. Possible Values: string of length 1..250',
		SERVICE_TYPE: 'Name of the service type',
		REMOTE_ID: 'The Remote ID string associated with the service.',
		AGENT_CIRCUIT_ID: 'The agent circuit ID associated with the service.',
		PROFILE_NAME: 'The profile-name to be used by the service.',
		UP_LINK_ENDPOINT:
			'One end of the service. Some services may not discriminate between uplink and downlink - these terms are used for clarity in identifying direction.',
		INTERFACE_ENDPOINT: 'An endpoint defined by an interface an 0, 1, or 2 VLANs.',
		CONTENT_PROVIDER: 'The name of the content provider for the endpoint.',
		OUTER_TAG_VLAN_ID: `The service endpoint outer VLAN tag. Untagged traffic will use the value of 'untagged'. Default Value: untagged Possible Values: untagged, any (Use any VLAN ID between a valid range of 1 to 4094 for tagged traffic) or uint16 in range 0..4094`,
		INNER_TAG_VLAN_ID: `The inner tag only applies when the outer tag is a specified VLAN ID. The service endpoint inner VLAN tag. A value of 'none' indicates there is no inner tag. Possible Values: none or uint16 in range 0..4094`,
		DOWN_LINK_ENDPOINT:
			'One end of the service. Some services may not discriminate between uplink and downlink - these terms are used for clarity in identifying direction.',
		INTERFACE_NAME: 'The name of the interface for the endpoint.',
	},
};
