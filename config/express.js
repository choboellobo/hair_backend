const express = require('express');
const glob = require('glob');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors')
const session = require('express-session')
const multer  = require('multer')
const path = require('path')

module.exports = (app, config) => {
	let env = process.env.NODE_ENV || 'development';
	app.locals.ENV = env;
	app.locals.ENV_DEVELOPMENT = env == 'development';

	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');

	// cors
	app.use(cors())

	// session
	app.use(session({
			secret: 'keyboard cat',
			resave: true,
			saveUninitialized: false,
			cookie: { secure: 'auto', maxAge: 60000000000 }
	}))

	// app.use(favicon(config.root + '/public/img/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({
		limit: '50mb',
		extended: true
	}));
	app.use(cookieParser());
	app.use(compress());
	app.use(express.static(config.root + '/public'));
	app.use(methodOverride());
	app.use(function(req, res , next){
		app.locals.session = req.session
		next()
	})

	var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
	controllers.forEach(function (controller) {
		require(controller)(app);
	});


	app.use(function (req, res, next) {
		var err = new Error('Not Found 404');
		err.status = 404;
		next(err);
	});

	if(app.get('env') === 'development'){
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			if(err.status === 404) return res.render('error/notfound', {session: req.session});
			res.render('error/error', {
				message: err.message,
				error: err,
				title: 'error'
			});
		});
	}

	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
			if(err.status === 404) return res.render('error/notfound', {session: req.session});
			res.render('error/error', {
				message: err.message,
				error: {},
				title: 'error'
			});
	});


		app.listen(config.port, function () {
			console.log('Express server listening on port ' + config.port);
		});


};
