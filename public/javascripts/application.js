// Click/touch abstraction event
// Extending the object prototype directly is never a good idea, but we can
// rely on it in this small scope
Object.prototype.touch = function(func) {
  var target, func;
  if (window.Touch){
    this.addEventListener('touchstart', function(e){
      e.preventDefault();
      if (!e.touches || e.touches.length > 1) return;
      target = this;
      addClass(this, 'touched');
    }, false);
    window.addEventListener('touchend', function(e){
      if (target) removeClass(target, 'touched');
    });
    this.addEventListener('touchend', function(e){
      e.preventDefault();
      if (func) func.apply(this, [e]);
    }, false);
  } else {
    this.addEventListener('click', func);
  }
}

/*  Add/remove class implementation  */
var addClass = function(element, className) {
  var re = new RegExp('(\\s|^)'+className+'(\\s|$)');
  if (re.test(element.className)) return;
  element.className += ' ' + className;
}
var removeClass = function(element, className) {
  var re = new RegExp('(\\s|^)'+className+'(\\s|$)');
  element.className = element.className.replace(re,' ');
}

/*  querySelectorAll shortcut method  */
var $ = function(q, e) {
  var e = e || document,
      match = e.querySelectorAll(q);
  // If there is only one match, return the object directly,
  // otherwise return the full NodeList
  return match.length > 1 ? match : match[0];
}

var Converter = {
  // Create the list of currencies dynamically from the dataset provided
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

  // Update the highlighted currencies in the currency selection list
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

  // Update the currency conversion display
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

  // 
  update_rates: function() {
    // Make an ajax call to get the latest exchange rates from the server
    // Use the rates from localStorage if offline
    if (!navigator.onLine) return;

    var currencies = [];
    for (var currency in window.currencies) {
      if (!window.currencies.hasOwnProperty(currency)) continue;
      currencies.push(currency);
    }

    // Async request for currencies
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

/*  Used to handle all the mathematical calculations */
var Calculator = {
  input: $('#input h1'),
  output: $('#output h1'),
  rate: 0,

  add: function(value) {
    var old = this.input.innerText !== '0' ? this.strip_commas(this.input.innerText) : '';
    this.update_values(old + value);
  },

  update_values: function(value) {
    var value = !value ? 0 : this.strip_commas(value),
        output_value = (isNaN(value)) ? '0.00' : (value * this.rate).toFixed(2);
    // Prevent numbers overlapping the allowed space
    // Let a line-length of 9 or less through
    if (value.length > 9 || output_value.length > 9) return;

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
        // Split off the decimals
        decimals = split[1] !== undefined ? '.'+split[1] : '';

    // Inject commas into the number
    while (re.test(num)) num = num.replace(re, '$1,$2');
    // Put the decimals back at the end
    return num + decimals;
  },

  strip_commas: function(num) {
    return num.replace(/,/g, '');
  }

}

/*  Initialisation / Button events  */
// If added to home screen...
if(navigator.standalone === undefined || !!navigator.standalone) {

  // On Android scroll the screen by 1 pixel to hide the address bar
  if (navigator.userAgent.match(/Android/i)) {
    window.addEventListener("load", function() { window.scrollTo(0,1); }, false);
  }

  // Show the converter & hide the install option by default
  $('#wrapper').style.display = 'block';
  $('#install').style.display = 'none';

  // Calculator button events
  var buttons = $('#input-pad p');
  for (var i = 0, ii = buttons.length; i < ii; i++) {
    if (!!buttons[i].id.length) continue;
    buttons[i].touch(function() { Calculator.add(this.innerText); });
  }
  $('#clear').touch(function(e) {
    Calculator.clear();
  });

  $('#input').touch(function(e) {
    addClass($('body'), 'edit-rates-from');
  });
  $('#output').touch(function(e) {
    addClass($('body'), 'edit-rates-to');
  });

  // Flip currencies
  $('#flip').touch(function(e) {
    addClass($('body'), 'flip');
    setTimeout(function() {
      var last = { from: window.from_to['from'], to: window.from_to['to'] }
      Converter.update_currency_display(last.to, last.from);
      if (Calculator.input.innerHTML.length >= 9 || Calculator.output.innerHTML.length >= 9) {
        Calculator.clear();
      }
    }, 130);
    setTimeout(function() { removeClass($('body'), 'flip'); }, 275);
  });

  // Draw the currency list
  Converter.draw_currencies();

  // Currency selection events
  var rates = $('#rate-selection a');
  for (var i = 0, ii = rates.length; i < ii; i++) {
    rates[i].touch(function(e) {
      e.preventDefault();

      var id = this.id.split('-');
      args = id[0] == 'from' ? [id[1], null] : [null, id[1]];
      Converter.update_currency_display.apply(Converter, args);
      Calculator.clear();
      removeClass($('body'), 'edit-rates-\\w+');
    });
  }

  // Show the credits screen when in landscape orientation
  var detectOrientation = function() {
    if (window.orientation) addClass($('body'), 'credits');
    else removeClass($('body'), 'credits');
  }
  detectOrientation();
  window.addEventListener('orientationchange', detectOrientation);

  // If working in offline mode, update the display to reflect this
  if (!navigator.onLine) $('#network-status').className = 'offline';

  // Update the currency display on load
  Converter.update_currency_display();
  // Delay making the ajax request to update the exchange rates
  // This prevents the app locking up while the request is made
  setTimeout(function() { Converter.update_rates(); }, 100);

  // Update the app cache when ready
  window.applicationCache.addEventListener('updateready', function(){
    window.applicationCache.swapCache();
  }, false);

// If opened in mobile safari directly,
} else {
  // show the install screen
  $('#wrapper').style.display = 'none';
  $('#install').style.display = 'block';
} 