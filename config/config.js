var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';
var mongodb = 'mongodb://localhost/hair'
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: 3000,
    db: mongodb
  },

  test: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: 3000,
    db: mongodb
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: 3000,
    db: mongodb
  }
};

module.exports = config[env];
