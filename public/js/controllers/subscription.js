(function(){
  let stripe = Stripe('pk_test_xzlKGfm0qMBrqy40YWFz4SHz');
  let elements = stripe.elements();
  // Create an instance of the card Element
  let card = elements.create('card');
  // Button pay
  const buttonPay = document.querySelector("#card-pay .card-action button");
  buttonPay.addEventListener('click', function(e){
    $('#preloader').modal('open');
    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('stripe-card-errors');
        errorElement.textContent = result.error.message;
        buttonPay.classList.add('disabled')
        $('#preloader').modal('close');
      } else {
        let form = document.querySelector('#form-pay')
            form.stripe_token.value = result.token.id
            form.submit()
      }
    });
  })

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#stripe-card');
  // Catch event errors
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('stripe-card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
      displayError.parentElement.classList.remove('hide')
      buttonPay.classList.add('disabled')
    } else {
      displayError.textContent = '';
      displayError.parentElement.classList.add('hide')
      buttonPay.classList.remove('disabled')
    }
  });


})()
