let express = require('express');
let router = express.Router();
let Profesional = require('../models/professional');

module.exports = function (app) {
	app.use('/', router);
};

router.get('/:id/*', function (req, res, next) {

	Profesional.findById(req.params.id)
		.then(
			professional => {
        console.log(professional);
				res.render('detail', {professional: professional});
			},
      error => res.json(error)
		);
});
