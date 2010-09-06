Object.prototype.touch = function(func){
  var y,
      moving;

  if (window.Touch){
    this.addEventListener('touchstart', function(e){
      e.preventDefault();

      if(!e.touches || e.touches.length > 1) return;

      y = (e.touches[0].pageY - this.offsetTop) - (this.offsetHeight / 2);
      this.className = y > 0 ? 'down' : 'up';

      this.addEventListener('touchmove', moving = function(e){

        if(!e.touches || e.touches.length > 1) return;

        y = (e.touches[0].pageY - this.offsetTop) - (this.offsetHeight / 2);
        this.className = y > 0 ? 'down' : 'up';
      }, false);

    }, false);

    this.addEventListener('touchend', function(e){
      e.preventDefault();

      this.className = '';
      this.removeEventListener('touchmove', moving);

      func.call(this, e, y);
    }, false);
  }
  else {
    this.addEventListener('mousedown', function(e){
      e.preventDefault();

      var y = e.offsetY - (this.offsetHeight / 2);
      this.className = y > 0 ? 'down' : 'up';

      this.addEventListener('mousemove', moving = function(e){
        var y = e.offsetY - (this.offsetHeight / 2);
        this.className = y > 0 ? 'down' : 'up';
      }, false);

    }, false);

    this.addEventListener('mouseup', function(e){
      e.preventDefault();
      
      var y = e.offsetY - (this.offsetHeight / 2);
      this.className = '';
      this.removeEventListener('mousemove', moving);

      func.call(this, e, y);
    }, false);
  }
}

var $ = function(q) {
  var result = document.querySelectorAll(q);
  return result.length > 1 ? result : result[0];
};

/*

  Handle button events

*/

var buttons = $('#input-pad p');
for (var i = 0, ii = buttons.length; i < ii; i++) {
  buttons[i].touch(function(e, y) { alert('y: ' + y); });
}