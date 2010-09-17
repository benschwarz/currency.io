Object.prototype.touch = function(func){
  var y,
      up,
      func,
      moving,
      target,
      start;

  if (window.Touch){
    this.addEventListener('touchstart', function(e){
      e.preventDefault();

      if(!e.touches || e.touches.length > 1) return;

      this.className = 'active';
      start = e.touches[0].pageY - this.offsetTop;

      this.addEventListener('touchmove', moving = function(e){

        y = start - (e.touches[0].pageY - this.offsetTop);

        if(!e.touches || e.touches.length > 1) return;
        if(!func) Drag.move.apply(this, [e, y]);

      }, false);

      if(!func) Drag.start.apply(this);

    }, false);

    this.addEventListener('touchend', function(e){
      e.preventDefault();

      this.className = '';
      this.removeEventListener('touchmove', moving);
      if(!func) Drag.end.apply(this);

      if(func) func.apply(this, [e]);
    }, false);
  }
  else {
    this.addEventListener('mousedown', function(e){
      e.preventDefault();

      target = this;
      this.className = 'active';
      start = e.pageY - target.offsetTop;

      if(!func) Drag.start.apply(this);

      window.addEventListener('mousemove', moving = function(e){
        var y = start - (e.pageY - target.offsetTop);

        if(!func) Drag.move.apply(target, [e, y]);

      }, false);

      window.addEventListener('mouseup', up = function(e){
        e.preventDefault();

        target.className = '';
        window.removeEventListener('mousemove', moving);
        window.removeEventListener('mouseup', up);

        if(!func) Drag.end.apply(target);

        if(func) func.apply(this, [e]);
      }, false);

    }, false);
  }
}

var $ = function(q, e) {
  var e = e || document,
      match = e.querySelectorAll(q);
  return match.length > 1 ? match : match[0];
};

/*

  Calculator

*/

var Calculator = {

  stack: [0],
  input: $('#input h1'),
  output: $('#output h1'),
  rate: 12.13,

  add: function(value) {
    var old_value = this.strip_commas(this.input.innerText),
        addition = this.strip_commas(value),
        // fix javascript's floating point rounding problem
        result = (old_value + addition).toFixed(2);

    this.update_values(result);
  },

  update_values: function(value) {
    this.stack.push(value);

    this.input.innerHTML = this.add_commas(value);
    this.output.innerHTML = this.add_commas(value * this.rate);
  },

  undo: function() {
    if(this.stack.length < 2) return;

    this.stack.pop();
    this.update_values(this.stack.pop());
  },

  undo_all: function() {
    this.stack = [];
    this.update_values(0);
  },

  add_commas: function(num) {
    var re = /(\d+)(\d{3,3})/,
        split = (''+num).split('.');

    var num = split[0],
        decimals = split[1] ? '.'+split[1].substr(0,2) : '.00';

    if((/\.\d$/).test(decimals)) decimals += '0';

    while (re.test(num)) num = num.replace(re, '$1,$2');
    return num + decimals;
  },

  strip_commas: function(num) {
    return parseFloat(num.replace(/,/g, ''));
  }
}

/*

  Handle button events

*/

Drag = {

  val: 0,

  start: function() {
    var container = $('.drag-ui', this),
        spans = $('span', container);

    container.style.display = 'block';

    spans[0].className = 'selected';
    Drag.val = spans[0].innerText;

    spans[0].style.marginTop = (container.offsetHeight / 2.8) +'px';
  },

  end: function() {
    $('.drag-ui', this).style.display = 'none';
    Calculator.add(Drag.val);
  },

  move: function(e, y) {
    var container = $('.drag-ui', this),
        spans = $('span', container),
        percent = y / 150,
        index = Math.floor(percent * spans.length);

    if(percent <= 0 || percent >= 1) return;

    for (var i = 0, ii = spans.length; i < ii; i++) {
      spans[i].className = '';
    }

    spans[0].style.marginTop = (-percent * ((spans[0].offsetHeight * spans.length) - (container.offsetHeight / 2.8))) + (container.offsetHeight / 2.8) +'px';

    spans[index].className = 'selected';
    Drag.val = spans[index].innerText;
  }
}

var buttons = $('#input-pad p');
for (var i = 0, ii = buttons.length; i < ii; i++) {

  if (buttons[i].id.length) continue;

  var html = '',
      val = Calculator.strip_commas(buttons[i].innerText);

  for (var j = 1; j < 10; j++) {
    var num = Calculator.add_commas(j * val)
        clean_num = (/^0/).test(num) ? num: num.replace(/\.\d+$/, '');
    html += '<span>'+ clean_num +'</span>';
  }

  buttons[i].innerHTML += '<div class="drag-ui">'+ html +'</div>';

  buttons[i].touch();
}

$('#undo').touch(function(e) {
  Calculator.undo();
});

$('#undo-all').touch(function(e) {
  Calculator.undo_all();
});