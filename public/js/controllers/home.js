(function(){
  // HOME controller
    let cards = $("#professionals .card")
        cards.hide()
  // MATERIALIZE
  $('.parallax').parallax();
  let flag = false;
  var options = [
     {
       selector: '#professionals',
       offset: 200,
       callback: function() {
         if(!flag){
           let cards = $("#professionals .card")
          //  cards.show()
          //  cards.addClass("fadeInUp animated")
          let timer = 0
           cards.each(function(i){
             setTimeout(function(){
               cards.eq(i).show().addClass("fadeInUp animated")
             },timer)
             timer+= 100
           })
           flag = true;
         }
       }
     },
     {
       selector: '#are_you_professional',
       offset: 200,
       callback: function(){
         $('h2.animated').removeClass('hide').addClass('bounceInLeft')
         $('div.animated').removeClass('hide').addClass('bounceInRight')
       }
     }
   ];
   Materialize.scrollFire(options);

   //**Worker**//
   let $worker = $(".worker");
   let $worker_plurals = $("#worker_plurals");
   let i = 0;
   let jobs = ['Peluquero', 'Peluquera', 'Barbero', 'Estilista','Maquillador','Maquilladora']
   let jobs_plurals = ['Peluqueros', 'Peluqueras', 'Barberos', 'Estilistas','Maquilladores','Maquilladoras']
   let interval = setInterval(function(){
     $worker.html(jobs[i])
     $worker_plurals.html(jobs_plurals[i])
     i++
     if(i == 5) i = 0
   },3000)
})()
