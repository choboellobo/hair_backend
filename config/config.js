var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
    ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

    /* MONGODB RELEASE */
    var mongodb;
    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
      mongodb = "mongodb://"+process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +process.env.OPENSHIFT_MONGODB_DB_HOST + ":" + process.env.OPENSHIFT_MONGODB_DB_PORT + "/" + process.env.OPENSHIFT_APP_NAME
    }else if(process.env.MONGODB_URI){
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
    db: mongodb,
    ip: ip
  },

  test: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: port,
    db: mongodb,
    ip: ip
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: port,
    db: mongodb,
    ip: ip
  }
};

module.exports = config[env];
