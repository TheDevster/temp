const winston = require('winston');

const winstonLogger = {
	type: 'Winston',
	options: {
		level: 'info',
		winston: {
			format: winston.format.combine(
				winston.format.colorize({ all: true }), //colorization to log messages
				winston.format.timestamp(),
				winston.format.json(), // JSON format for structured logs
			),
			transports: [
				new winston.transports.Console({
					// Apply colorized output for the console
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.simple(), // Simple format with colors for console
					),
				}),
			],
		},
	},
};

module.exports = winstonLogger;
