/*

    TODO:
    - Save exchange rates to local DB
    - Update exchange rates dynamically
    - Add support for decimal places (up to 2)
    - Online/offline indicators

*/

Object.prototype.addClick = function(func){
  if (window.Touch){
    this.addEventListener('touchstart', function(e){
      func.call(this);
      this.className += ' pressed';
    }, false);
    this.addEventListener('touchend', function(e){
      this.className = this.className.replace(/\spressed/g, '');
    }, false);
  } else {
    this.addEventListener('click', func);
  }
}

var $ = function(q) { return document.querySelectorAll(q) };

var CurrencyConverter = {
  rate: 0.0127199,
  input: $('section#from h1')[0],
  output: $('section#to h1')[0],
  buttons: $('section#numpad p'),
  currencies: null,
  
  init: function() {
    this.draw_currencies();
    this.currencies = $('div#currencies span');
    
    for (var i = 0, ii = this.buttons.length - 1; i < ii; i++){
      this.buttons[i].addClick(function() {
        (function(targ) {
          this.input.innerHTML.match(/^0$/) && (this.input.innerHTML = '');
          this.update_values(this.input.innerHTML + targ.innerHTML);
        }).call(CurrencyConverter, this);
      });
    }
    
    this.buttons[this.buttons.length-1].addClick(function() {
      (function(targ) {
        if (!!this.input.innerHTML.match(/^0$/)) return;
        this.update_values(this.input.innerHTML.substr(0, this.input.innerHTML.length - 1));
      }).call(CurrencyConverter, this);
    });
    
    for (var i = 0, ii = this.currencies.length; i < ii; i++){
      this.currencies[i].addClick(function(e) {
        var lis = this.parentNode.parentNode.parentNode.childNodes,
            li = this.parentNode.parentNode;
        for (var i = 0, ii = lis.length; i < ii; i++) {
          if(!lis[i].className) continue;
          lis[i].className = lis[i].className.replace(/\s\bselected\b/g, '');
        }
        li.className += ' selected';
        CurrencyConverter.update_currencies();
      });
    }
    
    $('section#rates')[0].addClick(function() {
      $('body')[0].className = 'change-currencies';
    });
    
    $('a#save-currencies')[0].addClick(function() {
      $('body')[0].className = '';
    });
    
    if(!navigator.onLine) $('p#network-status')[0].className = 'offline';
    else CurrencyConverter.update_currencies();
    
    // Disable page scrolling
    //document.addEventListener('touchmove', function(e){ e.preventDefault(); });
  },
  
  update_currencies: function() {
    var from_id = $("ul#from-currency li.selected")[0].id,
        to_id = $("ul#to-currency li.selected")[0].id,
        from = window.currencies[from_id],
        to = window.currencies[to_id],
        html = '';

    $("section#from h2")[0].innerHTML = from.symbol+' '+from.name;
    $("section#to h2")[0].innerHTML = to.symbol+' '+to.name;

    this.rate = from.rate_usd * (1 / to.rate_usd);

    html += '<em>'+from.symbol+'1.00</em>'+from_id;
    html += ' <span>&rarr;</span> ';
    html += to_id+'<em>'+to.symbol+(this.rate.toFixed(2))+'~</em>';
    $('section#rates')[0].innerHTML = html;

    this.input.innerHTML = this.output.innerHTML = "0";
  },
  
  draw_currencies: function() {
    var currency_list = '',
        currencies = window.currencies;

    for(var id in currencies) {
      if(!window.currencies.hasOwnProperty(id)) continue;
      currency_list += '<li id="'+id+'" data-rate="'+currencies[id].rate_usd+'">';
      currency_list += '<h1><span>'+currencies[id].symbol+' '+currencies[id].name+'</span></h1>';
      currency_list += '<h2>Synced: <strong>1 hour ago</strong></h2>';
      currency_list += '</li>';
    }
    
    $("ul#from-currency")[0].innerHTML = currency_list;
    $("ul#to-currency")[0].innerHTML = currency_list;
    
    $("ul#from-currency li:nth-child(1)")[0].className += ' selected';
    $("ul#to-currency li:nth-child(2)")[0].className += ' selected';
    
    this.update_currencies();
  },
  
  update_values: function(value) {
    var value = this.strip_commas(value),
        output_value = (value * this.rate).toFixed();
    
    if(!value) value = 0;
    
    this.input.innerHTML = this.add_commas(value);
    this.output.innerHTML = this.add_commas(output_value);
  },
  
  add_commas: function(num) {
    var re = /(\d+)(\d{3,3})/;
    while (re.test(num)) {
      num = num.replace(re, '$1,$2');
    }
    return num;
  },
  
  strip_commas: function(num) {
    return num.replace(/,/g, '');
  }
  
}

CurrencyConverter.init();