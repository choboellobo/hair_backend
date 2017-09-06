const express = require('express');
const router = express.Router();
const Professional = require('../models/professional');
const crypter = require('../helpers/crypto');
const cloudinary = require('cloudinary');
const multer  = require('multer')
const upload = multer({ dest: 'files/' })
const fs = require('fs')
const env = require('../env/env')

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
router.get('/working_images/:id/delete', (req, res, next) => {
  let p = req.session.professional;
  if(!p) return res.redirect('/login');
  Professional.findById(p).then(
    result => {
      let images = result.working_images.filter(elem => {
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
router.post('/working_images', upload.single('working_images'), (req, res ,next) => {
  let p = req.session.professional;
  if(!p) return res.redirect('/login');
  Professional.findById(p).then(
    result => {
      // Upload file to cloudinary
      cloudinary.uploader.upload(req.file.path, (image) => {
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
router.post('/avatar', (req, res ,next) => {
  let p = req.session.professional;
  if(!p) return res.redirect('/login');
  let img = req.body.avatar;
  Professional.findById(p).then(
    result => {
      // Upload file to cloudinary
      cloudinary.uploader.upload(img, (image) => {
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
router.post('/background', (req, res, next) => {
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
      cloudinary.uploader.upload(img, (image) => {
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
