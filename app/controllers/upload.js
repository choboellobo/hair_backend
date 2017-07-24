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
          deleteImageCloudinary(req.params.id).then(
            success => res.redirect(`/${req.session.slug}`),
            error => next(error)
          )
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
  Professional.findById(p).then(
    result => {
      // Upload file to cloudinary
      cloudinary.uploader.upload(req.file.path, function(image) {
        // When the image is already in cloudinary, push de object to array professional working_images
        result.working_images.unshift(image)
        result.save().then(
          done => {
            // Remove image local storage
            fs.unlink(req.file.path)
            res.redirect(`/${req.session.slug}`)
          }
        )
      });
    }
  )
})

/*
  UPLOAD IMAGE AVATAR TO cloudinary AND MONGODB
*/
router.post('/avatar', function(req, res ,next){
  let p = req.session.professional;
  if(!p) return res.redirect('/login');
  let img = req.body.avatar;
  Professional.findById(p).then(
    result => {
      // Upload file to cloudinary
      cloudinary.uploader.upload(img, function(image) {
        // When the image is already in cloudinary, push de object to array professional working_images
        result.avatar = image.url
        result.save().then(
          done => {
            res.redirect(`/${req.session.slug}`)
          }
        )
      });
    }
  )
})

/*
  UPLOAD background
*/
router.post('/background', function(req, res, next){
  let p = req.session.professional;
  let img = req.body.image;
  Professional.findById(p).then(
    professional => {
      if(professional.background) {
        deleteImageCloudinary(professional.background.public_id).then(
          () => {
            console.log("Imagen borrada correctamente")
          }
        )
      }
      cloudinary.uploader.upload(img, function(image) {
        professional.background = image;
        professional.save().then(
          res.redirect(`/${req.session.slug}`)
        )
      })
    }
  )
})


function deleteImageCloudinary (id) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, function(status){
      if(status.result == 'ok') resolve()
      else reject()
    })
  })

}
