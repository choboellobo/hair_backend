const express = require('express');
const router = express.Router();
const Admin = require('../../models/admin');
const crypter = require('../../helpers/crypto');
const jwt = require('../../helpers/jwt');

module.exports = function (app) {
  app.use('/api/admin', router);
};

router.post('/login', (req, res, next) => {
  Admin.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)}, {password: 0})
    .then(admin => {
      if(admin) res.status(200).json({admin: admin, token: jwt.generate({id: admin.id, type: 'admin'})})
      else res.status(400).end()
    })
    .catch(error => res.json(error))
})
