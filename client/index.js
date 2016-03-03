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

  $scope.query = function(){
    nodered('http://chyld-nodered.mybluemix.net/imgdata?score=0.50', 'get', null, function(res){
      console.log('***', res);
    });
  };

});


// ************************************** //

function nodered(url, method, data, cb){
  $.ajax({
    url: '/proxy?url=' + url,
    method: method,
    data: data,
    dataType: 'json',
    success: cb
  });
}

// ************************************** //
