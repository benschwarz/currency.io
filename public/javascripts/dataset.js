String.prototype.count = function(str) {
  return this.split(str).length
}

var currencies = JSON.stringify({
  EUR: { name: "Euro", symbol: "€", rate_usd: 1 },
  GBP: { name: "British Pound", symbol: "£", rate_usd: 1 },
  JPY: { name: "Japanese Yen", symbol: "¥", rate_usd: 1 },
  USD: { name: "US Dollars", symbol: "$", rate_usd: 1 },
  CHF: { name: "Swiss Francs", symbol: "chf", rate_usd: 1 },
  CAD: { name: "Canadian Dollars", symbol: "$", rate_usd: 1 },
  AUD: { name: "Australian Dollars", symbol: "$", rate_usd: 1 },
  SGD: { name: "Singapore Dollars", symbol: "$", rate_usd: 1 },
  HKD: { name: "Hong Kong Dollars", symbol: "$", rate_usd: 1 },
  NZD: { name: "New Zealand Dollars", symbol: "$", rate_usd: 1 }
});

if (!localStorage.currencies || localStorage.currencies.count(':') !== currencies.count(':')) {
  console.warn('refreshed currencies');
  localStorage.currencies = currencies;
  localStorage.from_to = '{ "from": "JPY", "to": "AUD" }';
}

window.currencies = JSON.parse(localStorage.currencies);
window.from_to = JSON.parse(localStorage.from_to);