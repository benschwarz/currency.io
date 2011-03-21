$(function() {
  var video;
  $('#watch-video').click(function() {
    $('#video').animate({top: '1em'});
  });

  $('#close-video').click(function() {
    $('#video').animate({top: '-48em'});
  });
});