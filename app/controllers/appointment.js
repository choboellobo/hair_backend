var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Appointment = require("../models/appointment"),
  jwt = require("../helpers/jwt");

module.exports = function(app) {
  app.use('/appointment', router);
};

/*
  POST /appointment
  Authorization: true admin
  Mandatory: {user: Id, professional: Id, service: Id, date: Date}
  Return: {201: Created, 401: No Authorization, 400: Bad request, 409: Conflics}
*/
router.post("/", jwt.middleware_admin, function(jwt_data, req, res, next) {
  if (!req.body.user) return next("user")
  if (!req.body.professional) return next("professional")
  if (!req.body.service) return next("service")
  if (!req.body.date) return next("date")
  /*
    Before create a new appointment, check if this appointment exists.
  */
  Appointment.exists(req.body.professional, req.body.date)
    .then(
      a => {
        if(a.length > 0) res.status(409).json({error: true, message: "Registro duplicado"})
        else saveAppointment()
      }
    )
    .catch( error => res.status(400).json({error : true, catch: error }) )

    function saveAppointment(){
      let new_appointment = new Appointment({
        user_id: req.body.user,
        professional_id: req.body.professional,
        service_id: req.body.service,
        date: req.body.date
      })
      new_appointment.save()
        .then( a => res.status(201).json(a) )
        .catch( error => res.status(400).json(error) )
    }

}, function(property, req, res, next) {
  res.status(400).json({
    error: true,
    message: `${property} no esta enviada.`
  })
})
/*
  DELETE /appointment/appointment_id
  Authorization: true admin
  Return: {200: Body Empty, 401: No Authorization, 400: Bad request}
*/
router.delete("/:appointment_id", jwt.middleware_admin, function(jwt_data, req, res, next){

  Appointment.remove({_id: req.params.appointment_id})
              .then(
                success => res.status(200).end()
              )
              .catch(
                error => res.status(400).json({error: true, catch: error})
              )
})


/*
  GET /appointment -> Retorna un array de appointments o el detalle de un appointment
  Authorization: true admin
  Mandatory: {user: Id, professional: Id, service: Id, date: Date}
  Return: {200: ArrayAppointments, 401: No Authorization, 400: Bad request}
*/
router.get("/", jwt.middleware_admin, function(jwt_data, req, res, next) {
  let options = {
    populate: [
      {path: "user_id", select: { password: 0 }},
      {path:"professional_id", select: {password: 0}},
      {path:"service_id"},
    ]
  };
  if(req.query.page) options.page = req.query.page
  Appointment.paginate({},options)
    .then(
      a => res.status(200).json(a)
    )
    .catch(
      error => res.status(400).json({
        error: true,
        catch: error
      })
    )
})
/*
  GET /appointment/:appointment_id -> Retorna el detalle de un appointment
  Authorization: true admin
  Mandatory: {user: Id, professional: Id, service: Id, date: Date}
  Return: {200: ArrayAppointments, 401: No Authorization, 400: Bad request}
*/
router.get("/:appointment_id", jwt.middleware_admin, function(jwt_data, req, res, next) {
  let appointment_id = req.params.appointment_id;

  Appointment.findById(appointment_id)
    .populate('user_id', {
      password: 0
    })
    .populate("professional_id", {
      password: 0
    })
    .populate("service_id")
    .then(
      a => res.status(200).json(a)
    )
    .catch(
      error => res.status(400).json({
        error: true,
        catch: error
      })
    )
})
/*
  GET /appointment/:professional_id
  Authorization: true admin
  Filter: {date: Date.toISOString }
  Return: {200: ArrayAppointments, 401: No Authorization, 400: Bad request}
*/
router.get("/professional/:professional_id",jwt.middleware_admin, function(jwt_data,req, res, next) {
  let date = req.query.date;
  let query = {
    professional_id: req.params.professional_id
  }
  if (date) query.date = new Date(date)
  Appointment.find(query)
    .then(
      a => res.status(200).json(a)
    )
    .catch(
      error => res.status(400).json({
        error: true,
        catch: error
      })
    )
})
