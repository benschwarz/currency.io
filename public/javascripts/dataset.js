String.prototype.count = function(str) {
  return this.split(str).length
}

var currencies = JSON.stringify({
  USD: { name: "US Dollar", symbol: "$", rate_usd: 1 },
  EUR: { name: "Euro", symbol: "€", rate_usd: 1 },
  GBP: { name: "British Pound", symbol: "£", rate_usd: 1 },
  CAD: { name: "Canadian Dollar", symbol: "$", rate_usd: 1 },
  AUD: { name: "Australian Dollar", symbol: "$", rate_usd: 1 },
  JPY: { name: "Japanese Yen", symbol: "¥", rate_usd: 1 },
  KRW: { name: "South Korean Won", symbol: "₩", rate_usd: 1 },
  NZD: { name: "New Zealand Dollar", symbol: "$", rate_usd: 1 },
  CHF: { name: "Swiss Franc", symbol: "chf", rate_usd: 1 },
  SGD: { name: "Singapore Dollar", symbol: "$", rate_usd: 1 },
  HKD: { name: "Hong Kong Dollar", symbol: "$", rate_usd: 1, 1:0 }
});

if (!localStorage.currencies || localStorage.currencies.count(':') !== currencies.count(':')) {
  localStorage.currencies = currencies;
  localStorage.from_to = '{ "from": "JPY", "to": "AUD" }';
}

window.currencies = JSON.parse(localStorage.currencies);
window.from_to = JSON.parse(localStorage.from_to);