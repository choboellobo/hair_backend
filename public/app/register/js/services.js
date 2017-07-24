angular.module('register')
.service('api', function($http){
  this.googleAddress = street => {
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+street)
  }
  this.createProfessional = professional => {
    return $http.post('/api/professional', professional);
  }
  this.updateProfessional = professional => {
    let config = {
      headers: {
        'Authorization': sessionStorage.getItem('token'),
      }
    };
    let id = sessionStorage.getItem('professional_id');
    return $http.patch('/api/professional/'+ id, professional, config )
  }
})
