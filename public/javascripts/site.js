$(function() {
  var video = $('video').mediaelementplayer({
    pluginPath: '/me/',
    poster: '/videos/currency-demo.png',
    videoWidth: 320,
    videoHeight: 480
  });

  $('#watch-video').click(function() {
    $('#video').show();
  })

  $('#close-video').click(function() {
    video.stop();
    $('#video').fadeOut();
  })
})