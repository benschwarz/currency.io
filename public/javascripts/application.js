/*

    TODO:
    - Add support for decimal places (up to 2)
    - Last synced

*/
Object.prototype.touch = function(func) {

  var up,
      func,
      moving,
      target;

  if (window.Touch){

    this.addEventListener('touchstart', function(e){
      e.preventDefault();

      if(!e.touches || e.touches.length > 1) return;

      this.className = 'active';
      this.addEventListener('touchmove', moving = function(e){}, false);

    }, false);

    this.addEventListener('touchend', function(e){
      e.preventDefault();

      this.className = '';
      this.removeEventListener('touchmove', moving);

      if(func) func.apply(this, [e]);

    }, false);

  } else {

    this.addEventListener('click', func);

  }

}

var $ = function(q, e) {
  var e = e || document,
      match = e.querySelectorAll(q);
  return match.length > 1 ? match : match[0];
}

var Calculator = {
  input: $('#input h1'),
  output: $('#output h1'),
  rate: 12.136,

  add: function(value) {
    var old = this.input.innerText !== '0' ? this.strip_commas(this.input.innerText) : '';
    this.update_values(old + value);
  },

  update_values: function(value) {
    var value = this.strip_commas(value),
        output_value = (value * this.rate).toFixed();

    if(!value) value = 0;

    this.input.innerHTML = this.add_commas(value);
    this.output.innerHTML = this.add_commas(output_value);
  },

  clear: function() {
    this.update_values('0');
  },

  add_commas: function(num) {
    var re = /(\d+)(\d{3,3})/,
        split = num.split('.'),
        num = split[0],
        decimals = split[1] !== undefined ? '.'+split[1] : '';

    while (re.test(num)) num = num.replace(re, '$1,$2');
    return num + decimals;
  },

  strip_commas: function(num) {
    return num.replace(/,/g, '');
  }

}

/*

  Handle button events

*/

var buttons = $('#input-pad p');
for (var i = 0, ii = buttons.length; i < ii; i++) {
  if(!!buttons[i].id.length) continue;
  buttons[i].touch(function() { Calculator.add(this.innerText); });
}

$('#clear').touch(function(e) {
  Calculator.clear();
});
