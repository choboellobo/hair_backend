angular.module('register',['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('step_one',{
      url: '/',
      templateUrl: '/app/register/views/step_one.html',
      controller: 'step_one as vm'
    })
    .state('step_two',{
      templateUrl: '/app/register/views/step_two.html',
      controller: 'step_two as vm'
    })
    .state('step_final',{
      templateUrl: '/app/register/views/step_final.html'
    })

})
.directive('materializeDatepicker', function(){
  return {
    link: function($scope, $elem, $attr){
      $($elem).pickadate({
        // Strings and translations
monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        selectMonths: true,
        selectYears: 100,
        today: 'Hoy',
        clear: 'Borrar',
        close: 'Aceptar',
        firstDay: 1,
        max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        format: 'dd/mm/yyyy',
        onSet: function(context) {
          $scope.$apply($scope.vm.professional.birthday = new Date(context.select))
        }
      });
    }
  }
})
