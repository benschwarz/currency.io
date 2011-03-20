$(function() {
  var video;
  $('#watch-video').click(function() {
    $('#video').show();
  });

  $('#close-video').click(function() {
    video.stop();
    $('#video').fadeOut();
  });
});