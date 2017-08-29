var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    port =  process.env.PORT || 3000,
    ip = '127.0.0.1';

    /* MONGODB RELEASE */
    var mongodb;
    if(process.env.MONGODB_URI){
      mongodb = process.env.MONGODB_URI
    } else {
      mongodb = 'mongodb://localhost/hair';
    }
var config = {
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
