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
           console.log(flag)
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
     }
   ];
   Materialize.scrollFire(options);
})()
