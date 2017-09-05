angular.module('register')
.controller('step_one', function($scope, api, $state, $email, $rootScope){
  let vm = this;
      vm.complete = false;
      vm.loading = false
      vm.professional = {
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        birthday: null,
        gender: null,
        phone: null,
        avatar: null,
        address: {}
      }
      vm.getAddress = address => {
        vm.addressResults = null;
        if(address.length > 5) {
          api.googleAddress(address).then(
            res => vm.addressResults = res.data.results
          )
        }else {
          vm.complete = false
        }
      }
      vm.setAddress = item => {
        vm.addressResults = null;
        vm.address = item.formatted_address;
        vm.professional.address = {}
        vm.professional.address.coordinates = item.geometry.location;
        for(let place of item.address_components){
          if( place.types.includes('street_number')) vm.professional.address.number = place.long_name
          if( place.types.includes('route')) vm.professional.address.place = place.long_name
          if( place.types.includes('locality')) vm.professional.address.location = place.long_name
          if( place.types.includes('administrative_area_level_4')) vm.professional.address.location = place.long_name
          if( place.types.includes('postal_code')) vm.professional.address.postal_code = place.long_name
        }
        vm.complete = true;
      }
      vm.registerProfessional = () => {
        vm.loading = !vm.loading;
        vm.professional.gender == 'male' ? vm.professional.avatar = '/img/avatar_man.png' : vm.professional.avatar = '/img/avatar_woman.png'
        if(checkEmail(vm.professional.email)){
          $email.check(vm.professional.email).then(
            success => {
              if(success.data.mx_found && success.data.smtp_check && success.data.score > 0.5){
                vm.professional.active = true;
                createProfessional();
              }else {
                vm.error = "No podemos verificar la existencia de este email, prueba con otro."
              }
            }
          )
        }else {
          createProfessional();
        }
        /* Method to create a professional */
        function createProfessional(){
          api.createProfessional(vm.professional)
            .then(
              success => {
                vm.loading = !vm.loading;
                sessionStorage.setItem('token', success.data.token);
                sessionStorage.setItem('professional_id', success.data.professional.id)
                $rootScope.professional = success.data.professional;
                $state.go('step_two');
              },
              error => {
                vm.loading = !vm.loading;
                if(error.status == 403) vm.error = "El email ya existe, intentalo con otro."
                else vm.error = "Hubo un error intentalo de nuevo más tarde"
              }
            )
        }

      }
      checkEmail = function(email){
        let domain = ['@hotmail', '@live', '@outlook'];
        for(let i in domain ){
          if(email.includes(domain[i])){
            return true;
            break;
          }
        }
        return false;
      }
})
.controller('step_two', function(api, $state, $rootScope){
  let vm = this;
      vm.complete = false;
      vm.options = [
        {name: '¿Trabajas a domicilio?', icon: 'fa-home', model: 'home'},
        {name: '¿Trabajas en algún local?', icon: 'fa-building', model: 'store'}
      ]
      vm.professional = {
        address: {},
        options : {
          home: false,
          store: false,
          payments: {
            card: false,
            cash: true
          }
        }
      }
      vm.getAddress = address => {
        vm.addressResults = null;
        if(address.length > 5) {
          api.googleAddress(address).then(
            res => vm.addressResults = res.data.results
          )
        }else {
          vm.complete = false
        }
      }
      vm.setAddress = item => {
        vm.addressResults = null;
        vm.address = item.formatted_address;
        vm.professional.address = {}
        vm.professional.address.coordinates = item.geometry.location;
        for(let place of item.address_components){
          if( place.types.includes('street_number')) vm.professional.address.number = place.long_name
          if( place.types.includes('route')) vm.professional.address.place = place.long_name
          if( place.types.includes('locality')) vm.professional.address.location = place.long_name
          if( place.types.includes('administrative_area_level_4')) vm.professional.address.location = place.long_name
          if( place.types.includes('postal_code')) vm.professional.address.postal_code = place.long_name
        }
        vm.complete = true;
      }
      vm.updateProfessional = () => {
        if($rootScope.professional.active) return window.location.href = "/professional/login";
        // If there is not any changes.
        if(!vm.professional.options.home && !vm.professional.options.store ) return $state.go('step_final')

        if(vm.professional.address.number) vm.professional.address.place = vm.professional.address.place + ' ' +vm.professional.address.number
        vm.professional.options.payments.card = vm.professional.options.card;
        api.updateProfessional(vm.professional)
            .then(
              success => {
                $state.go('step_final')
              },
              error => {
                vm.error = true;
              }
            )
      }
})
