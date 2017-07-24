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
    image: "https://thumb9.shutterstock.com/display_pic_with_logo/2711341/568820482/stock-photo-skillful-hairdresser-cutting-male-hair-568820482.jpg"
  },
  {
    name: "Cortar, peinar y lavar",
    image: "https://thumb1.shutterstock.com/display_pic_with_logo/64260/548285116/stock-photo-beauty-and-people-concept-happy-young-woman-with-hairdresser-washing-head-at-hair-salon-548285116.jpg"
  },
  {
    name: "Maquillaje",
    image: "https://thumb1.shutterstock.com/display_pic_with_logo/1532018/288406793/stock-photo-makeup-artist-preparing-bride-before-the-wedding-in-a-morning-288406793.jpg"
  },
  {
    name: "Peinados y recogidos",
    image: "https://thumb1.shutterstock.com/display_pic_with_logo/3740375/541580689/stock-photo-hairdresser-working-at-the-beauty-studio-salon-making-hair-style-541580689.jpg"
  },
  {
    name: "Barberia",
    image: "https://thumb1.shutterstock.com/display_pic_with_logo/1998197/364870139/stock-photo-getting-perfect-shape-close-up-side-view-of-young-bearded-man-getting-beard-haircut-by-hairdresser-364870139.jpg"
  },
  {
    name: "Teñir",
    image: "https://thumb7.shutterstock.com/display_pic_with_logo/158350/534447844/stock-photo-hairdresser-coloring-hair-in-studio-534447844.jpg"
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
