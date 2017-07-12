(function() {
  // Upload new working images
  $('[type="file"]').on('change', function(e) {
    let input = $(this)
    let file = e.target.files[0];
    let reader = new FileReader();
        reader.onload = function(e){
          let img = new Image()
              img.onload = function() {
                $('#'+ input.data('form')).submit()
              }
              img.src = e.target.result
        }
        reader.readAsDataURL(file)
  })
  // Materialize
  $('.scrollspy').scrollSpy({
    scrollOffset: 0
  });
  $('select').material_select();
  $('.materialboxed').materialbox();
  $('.carousel').carousel();
  $(".button-collapse").sideNav({
    closeOnClick: true,
  });
})()
