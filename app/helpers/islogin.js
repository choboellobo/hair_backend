module.exports = (req, res, next) => {
  if(!req.session.professional) res.redirect('/professional/login')
  else next()
}
