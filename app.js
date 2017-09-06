const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');

mongoose.connect(config.db);
let db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

let models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
let app = express();

require('./config/express')(app, config);

module.exports = app;
