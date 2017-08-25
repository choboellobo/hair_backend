(function() {

  // MODAL PROFILE PICTURE
  $('#modal-avatar').modal({
    ready: function(){
      $('#modal-avatar input[type="file"]').on('change', function(e) {
				let file = e.target.files[0];
				let reader = new FileReader();
				reader.onload = function(e) {
					$('#modal-avatar form').hide()
					$('#modal-avatar img').attr('src', e.target.result)
					$('#crop-avatar').cropper({
						aspectRatio: 4 / 4,
						viewMode: 2
					})
				}
				reader.readAsDataURL(file)
			})
    },
    complete: function() {
      $('#crop-avatar').cropper('destroy');
			$('#modal-avatar img').attr('src', null)
			$('#modal-avatar form')[0].reset()
      $('#modal-avatar form').show()
    }
  })
  $('#modal-avatar button[cut]').on('click', function() {
		let image = $('#crop-avatar').cropper('getCroppedCanvas').toDataURL('image/png')
		$('.brand-logo .avatar').attr('src', image)
		$('#form-upload-avatar input').val(image);
		$('#form-upload-avatar').submit()
		$('#modal-avatar').modal('close')
		$('#preloader').modal('open', {
			dismissible: false
		});
	})
  // MODAL background
	// Cut image background
	$('#modal-background').modal({
		ready: function(modal, trigger) {
			$('#modal-background input[type="file"]').on('change', function(e) {
				let file = e.target.files[0];
				let reader = new FileReader();
				reader.onload = function(e) {
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
      $('#modal-background form').show()
		}
	});
	$('#modal-background button[cut]').on('click', function() {
		let image = $('#crop').cropper('getCroppedCanvas').toDataURL('image/jpeg')
		$('header').css('background-image', 'url(' + image + ')')
		$('#form-background input').val(image);
		$('#form-background').submit()
		$('#modal-background').modal('close')
		$('#preloader').modal('open', {
			dismissible: false
		});
	})
	// ****** Upload new working images   *******/
	$('[type="file"]').on('change', function(e) {
		let input = $(this)
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.onload = function(e) {
			let img = new Image()
			img.onload = function() {
				$('#' + input.data('form')).submit();
				if (input.data('form')) {
					$('#preloader').modal('open', {
						dismissible: false
					});
				}
			}
			img.src = e.target.result
		}
		reader.readAsDataURL(file)
	})
	//******  Materialize GET START *********//
	$('.scrollspy').scrollSpy({
		scrollOffset: 0
	});
	$('select').material_select();
	$('.materialboxed').materialbox();
	$('#work .carousel').carousel();
	$(".button-collapse").sideNav({
		closeOnClick: true,
	});

  /***** Slider tutorial *****/
  let alreadyTutorial = JSON.parse(localStorage.getItem('tutorial'));
  if(!alreadyTutorial){
    $('#modal-tutorial').modal('open', {
      complete: function(){
        localStorage.setItem('tutorial', 'true');
      }
    })
    $('#modal-tutorial .carousel.carousel-slider').carousel({fullWidth: true});

    //** Change slider**//
    $("#modal-tutorial button[next]").on('click', function(){
      $('#modal-tutorial .carousel.carousel-slider').carousel('next')
    })
  }

})()
