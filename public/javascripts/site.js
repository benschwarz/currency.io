$(function() {
  var video;
  $('#watch-video').click(function() {
    $('#video').show();
    video = $('video').mediaelementplayer({
      pluginPath: '/me/',
      poster: '/videos/currency-demo.png',
      videoWidth: 320,
      videoHeight: 480
    });
  });

  $('#close-video').click(function() {
    video.stop();
    $('#video').fadeOut();
  });
});