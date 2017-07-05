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
        selectMonths: true,
        selectYears: 100,
        today: 'Hoy',
        clear: 'Borrar',
        close: 'Cerrar',
        firstDay: 1,
        max: new Date(),
        format: 'dd/mm/yyyy',
        onSet: function(context) {
          $scope.$apply($scope.vm.professional.birthday = new Date(context.select))
        }
      });
    }
  }
})
