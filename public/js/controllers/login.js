(function(){

  $('#forgetPassword').on('click', function(event){
    event.preventDefault()
    let $form = $('#formRecoveryPassword')
    if($form.hasClass('hide')) $form.removeClass('hide')
    else $form.addClass('hide')
  })

})()
