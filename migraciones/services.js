const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hair');

const db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

let Service = require('../app/models/service');
Service.collection.drop();
var data = [
  {
    name: "Cortar y lavar caballero",
    image: "http://www.muysencillo.com/wp-content/uploads/2015/02/Hombres-pelo-corto-330x220.jpg"
  },
  {
    name: "Cortar, peinar y lavar",
    image: "http://static.ellahoy.es/ellahoy/fotogallery/843X0/33849/cortes-de-pelo-verano-2012-pelo-corto.jpg"
  },
  {
    name: "Maquillaje",
    image: "https://maquilladas.com/wp-content/2012/03/Pruebas-de-maquillaje-y-peluquer%C3%ADa-para-novias-2.jpg"
  },
  {
    name: "Peinados",
    image: "http://www.desancho.com/web/wp-content/uploads/2015/09/Tendencia-para-recogidos-en-eventos-y-fiestas.jpg"
  },
  {
    name: "Barberia",
    image: "http://www.thuya.com/escuela/images/cursos/inten/pelu/cu/Imatge_Web_Barberia.jpg"
  }
]
  for(let i = 0; i<data.length; i++){
    console.log(data[i].name)
    saveData(data[i]);
  }
  function saveData(ser) {
    let s = new Service(ser);
        s.save(function(err, success){
          if(err) return console.log(err)
          console.log("Data saved successfully")
        })
  }
