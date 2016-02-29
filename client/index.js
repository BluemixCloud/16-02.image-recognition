/* global angular, Webcam */

angular.module('template', [])
.controller('MainCtrl', function($scope){
  let data;

  $scope.on = function(){
    Webcam.attach('#my_camera');
  };

  $scope.take = function(){
    Webcam.snap(function(data_uri){
      document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
      data = data_uri;
    });
  };
  
  $scope.upload = function(){
    Webcam.upload(data, '/upload', function(code, text){
      console.log('code:', code, 'text:', text);
    });
  };

});
