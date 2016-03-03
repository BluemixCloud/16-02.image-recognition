/* global angular, Webcam, Recorder, AudioContext, URL */

angular.module('template', [])
.controller('MainCtrl', function($scope){

  // ************************************************************************ //
  // ************************************************************************ //
  // ************************************************************************ //

  var audio_context;
  var recorder;

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //console.log('Input connected to audio context destination.');

    recorder = new Recorder(input);
    console.log('Recorder initialised.');
  }


    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext;
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      console.log('No live audio input: ' + e);
    });


  // ************************************************************************ //
  // ************************************************************************ //
  // ************************************************************************ //




  $scope.startRec = function(){
    recorder && recorder.record();
    console.log('Recording...');
  };

  $scope.stopRec = function(){
    recorder && recorder.stop();
    console.log('Stopped recording.');
    createDownloadLink();
    recorder.clear();
  };


function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
      console.log('*****blob********', blob);

      var formData = new FormData();
      formData.append("superfile", blob);
      var request = new XMLHttpRequest();
      request.open("POST", "/audio");
      request.send(formData);
    });
  }



  $scope.downRec = function(){

  };



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
