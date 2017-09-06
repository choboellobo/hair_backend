const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';
const port =  process.env.PORT || 3000;

		/* MONGODB RELEASE */
let mongodb;
if(process.env.MONGODB_URI){
	mongodb = process.env.MONGODB_URI
} else {
	mongodb = 'mongodb://localhost/hair';
}
let config = {
	development: {
		root: rootPath,
		app: {
			name: 'api'
		},
		port: port,
		db: mongodb
	},

	test: {
		root: rootPath,
		app: {
			name: 'api'
		},
		port: port,
		db: mongodb
	},

	production: {
		root: rootPath,
		app: {
			name: 'api'
		},
		port: port,
		db: mongodb
	}
};

module.exports = config[env];
