let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hair');
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});
let ProfessionalModel = require('../app/models/professional');

let professional = {
	"options": {
		"home": true,
		"store": true,
		"payments": {
			"card": true,
			"cash": true
		}
	},
	"services": [{
			"price": 10,
			"service": "5956889261411c0988556e4b"
		},
		{
			"price": 8,
			"service":"595688d561411c0988556e4d"
		}
	],
	"email": "desconocido@barber.es",
	"background": "http://madriddiferente.com/wp-content/gallery/compadre-barbers-club/Barberia-COMPADRE-BARBERs-club-cortes-de-calidad.jpg",
	"working_images": [
		"http://scontent.cdninstagram.com/t51.2885-15/s480x480/e35/13116646_1025061047569693_1417809783_n.jpg?ig_cache_key=MTI1NzUwMDU5MDM1OTMzNTg5Ng%3D%3D.2",
		"http://www.duendemad.com/sites/default/files/Barbers_IG_V1_0005_6.png",
		"http://hauteliving.com/wp-content/uploads/2010/10/lede1.jpg"
	],
	"description": "<p>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se</p><p>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se</p>",
	"avatar": "https://static1.squarespace.com/static/56f45a8c22482e23186b6881/t/56f49ee360b5e93ce6e62b44/1458872048697/barberia88_barbero_profesional_emmanuel_suarez.jpg",
	"password": "1111111",
	"first_name": "Julian",
	"last_name": "Martin Perez",
	"document_id": "12200109T",
	"phone": 665882020,
	"working_place": [
		47000,
		47140
	],
	"address": {
		"place": "Tirso de molina 4",
		"location": "Valladolid",
		"postal_code": 47010
	}
}
let  p = new ProfessionalModel(professional)
     p.save(function(err, d){
       if(err) console.log(err.message)
       if(!err) console.log("New professional created sucessfully")
       process.exit()
     })
