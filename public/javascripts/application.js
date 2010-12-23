
Object.prototype.touch = function(func) {
  var target, func, moving;

  if (window.Touch){
    this.addEventListener('touchstart', function(e){
      e.preventDefault();

      if (!e.touches || e.touches.length > 1) return;

      target = this;
      this.className += ' touched';
      this.addEventListener('touchmove', moving = function(e){}, false);
    }, false);

    window.addEventListener('touchend', function(e){
      if (target) target.className = target.className.replace(/\stouched/, '');
    });

    this.addEventListener('touchend', function(e){
      e.preventDefault();

      this.removeEventListener('touchmove', moving);
      if (func) func.apply(this, [e]);
    }, false);
  } else {
    this.addEventListener('click', func);
  }

}

var addClass = function(element, className) {
  var re = new RegExp('(\\s|^)'+className+'(\\s|$)');
  if (re.test(element.className)) return;
  element.className += ' ' + className;
}

var removeClass = function(element, className) {
  var re = new RegExp('(\\s|^)'+className+'(\\s|$)');
  element.className = element.className.replace(re,' ');
}

var $ = function(q, e) {
  var e = e || document,
      match = e.querySelectorAll(q);
  return match.length > 1 ? match : match[0];
}

var Converter = {

  draw_currencies: function() {
    var html = '',
        currencies = window.currencies;

    for (var id in currencies) {
      if (!window.currencies.hasOwnProperty(id)) continue;

      html += '<li>';
      html += '<a href="#" id="from-'+id+'">&nbsp;</a>';
      html += '<em>'+currencies[id].symbol+'</em> '+currencies[id].name+' <em>('+id+')</em>';
      html += '<a href="#" id="to-'+id+'">&nbsp;</a>';
      html += '</li>';
    }

    $('#rate-selection ul').innerHTML = html;
  },

  highlight_currencies: function(from_id, to_id) {
    window.from_to.from = from_id;
    window.from_to.to = to_id;
    localStorage.from_to = JSON.stringify(window.from_to);

    for (var i = 0, ii = rates.length; i < ii; i++) {
      rates[i].className = '';
    }
    $('#from-'+from_id).className = 'selected';
    $('#to-'+to_id).className = 'selected';
  },

  update_currency_display: function(from_id, to_id) {
    var from_id = from_id || window.from_to.from,
        to_id = to_id || window.from_to.to,
        from = window.currencies[from_id],
        to = window.currencies[to_id];

    this.highlight_currencies(from_id, to_id)

    Calculator.rate = from.rate_usd * (1 / to.rate_usd);

    $("#input h2").innerHTML = '<em>'+from.symbol+'</em> '+from.name;
    $("#output h2").innerHTML = '<em>'+to.symbol+'</em> '+to.name;

    html = from_id+' <em>&rarr;</em> '+to_id;
    $('#rates span').innerHTML = html;

    Calculator.add('');
  },

  update_currencies: function() {
    if (!navigator.onLine) return;

    var currencies = [];
    for (var currency in window.currencies) {
      if (!window.currencies.hasOwnProperty(currency)) continue;
      currencies.push(currency);
    }

    var r = new XMLHttpRequest();
    r.open('POST', '/exchange?currencies='+currencies.toString(), true);
    r.send(null);

    r.onreadystatechange = function() {
      if (r.readyState === 4) {
        if (this.status == 200) {
          var data = JSON.parse(r.responseText);
          for (var key in data) {
            if (data.hasOwnProperty(key) && key !== 'USD') {
              window.currencies[key].rate_usd = data[key];
            }
          }

          localStorage.currencies = JSON.stringify(window.currencies);
          Converter.update_currency_display();
        } else {
          console.error('Request failed.');
        }
      }
    }

  }
}

var Calculator = {
  input: $('#input h1'),
  output: $('#output h1'),
  rate: 0,

  add: function(value) {
    var old = this.input.innerText !== '0' ? this.strip_commas(this.input.innerText) : '';
    this.update_values(old + value);
  },

  update_values: function(value) {
    var value = this.strip_commas(value),
        output_value = (value * this.rate).toFixed(2);

    if (!value) value = 0;
    if (!(/\./).test(value) && (value.length > 5 || output_value.length > 6))
      output_value = output_value.slice(0, -3);
    if (value.length > 9 || output_value.length > 9) return;

    if ((/^0?\.*$/).test(value)) output_value = '0';

    this.input.innerHTML = this.add_commas(value);
    this.output.innerHTML = this.add_commas(output_value);
  },

  clear: function() {
    this.update_values('0');
  },

  add_commas: function(num) {
    var re = /(\d+)(\d{3,3})/,
        split = (''+num).split('.'),
        num = split[0],
        decimals = split[1] !== undefined ? '.'+split[1] : '';

    while (re.test(num)) num = num.replace(re, '$1,$2');
    return (num || 0) + decimals;
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
  if (!!buttons[i].id.length) continue;
  buttons[i].touch(function() { Calculator.add(this.innerText); });
}

$('#clear').touch(function(e) {
  Calculator.clear();
});

$('#input').touch(function(e) {
  addClass($('body'), 'edit-rates');
});
$('#output').touch(function(e) {
  addClass($('body'), 'edit-rates');
});

$('#flip').touch(function(e) {
  addClass($('body'), 'flip');
  setTimeout(function() {
    var last = { from: window.from_to['from'], to: window.from_to['to'] }
    Converter.update_currency_display(last.to, last.from);
  }, 130);
  setTimeout(function() { removeClass($('body'), 'flip'); }, 275);
});

$('#save').touch(function(e) {
  removeClass($('body'), 'edit-rates');
});

Converter.draw_currencies();

var rates = $('#rate-selection a');
for (var i = 0, ii = rates.length; i < ii; i++) {
  rates[i].touch(function(e) {
    e.preventDefault();

    var ref = this.id.split('-');
    args = ref[0] == 'from' ? [ref[1], null] : [null, ref[1]];
    Converter.update_currency_display.apply(Converter, args);
  });
}

var detectOrientation = function() {
  if (window.orientation) addClass($('body'), 'credits');
  else removeClass($('body'), 'credits');
}
detectOrientation();
window.addEventListener('orientationchange', detectOrientation);

if (!navigator.onLine) $('#network-status').className = 'offline';

Converter.update_currency_display();
setTimeout(function() { Converter.update_currencies(); }, 100);