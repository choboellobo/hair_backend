let express = require('express');
let router = express.Router();
let Professional = require('../models/professional');
let crypter = require('../helpers/crypto');
let cloudinary = require('cloudinary');
let multer  = require('multer')
let upload = multer({ dest: 'files/' })
let fs = require('fs')
let env = require('../env/env')

cloudinary.config({
  cloud_name: env.cloudinary.cloud_name,
  api_key: env.cloudinary.api_key,
  api_secret: env.cloudinary.api_secret
});


module.exports = function (app) {
  app.use('/upload', router);
};
/*
 DELETE A IMAGE FROM cloudinary AND MONGODB
*/
router.get('/working_images/:id/delete', function(req, res, next) {
  let p = req.session.professional;
  if(!p) return res.redirect('/login');
  Professional.findById(p).then(
    result => {
      let images = result.working_images.filter(function(elem){
        return elem.public_id !== req.params.id
      })
      result.working_images = images;
      result.save().then(
        success => {
          cloudinary.uploader.destroy(req.params.id, function(status){
            console.log(status)
            res.redirect(`/${p}`)
          })
        }
      )
    }
  )
})

/*
  UPLOAD IMAGE TO cloudinary AND MONGODB
*/
router.post('/working_images', upload.single('working_images'), function(req, res ,next){
  let p = req.session.professional;
  if(!p) return res.redirect('/login');
  console.log(req.file)
  Professional.findById(p).then(
    result => {
      // Upload file to cloudinary
      cloudinary.uploader.upload(req.file.path, function(image) {
        // When the image is already in cloudinary, push de object to array professional working_images
        result.working_images.push(image)
        result.save().then(
          done => {
            // Remove image local storage
            fs.unlink(req.file.path)
            res.redirect(`/${p}`)
          }
        )
      });
    }
  )
})
