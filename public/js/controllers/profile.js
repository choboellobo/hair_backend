(function() {
  // Cut image background
  $('#modal-background').modal({
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('#modal-background input[type="file"]').on('change', function(e){
          let file = e.target.files[0];
          let reader = new FileReader();
              reader.onload = function(e){
                $('#modal-background form').hide()
                $('#modal-background img').attr('src', e.target.result)
                $('#crop').cropper({
                 aspectRatio: 16 / 9,
                 viewMode: 2
                })
              }
              reader.readAsDataURL(file)
        })
      },
      complete: function() {
        $('#crop').cropper('destroy');
        $('#modal-background img').attr('src', null)
        $('#modal-background form')[0].reset()
      }
  });
  $('#modal-background button[cut]').on('click', function(){
    let image = $('#crop').cropper('getCroppedCanvas').toDataURL('image/jpeg')
    $('header').css('background-image','url('+image+')')
    $('#modal-background').modal('close')
  })
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
