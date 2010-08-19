localStorage.currencies = JSON.stringify({
  "JPY": {
    "name": "Japanese Yen",
    "symbol": "¥",
    "rate_usd": "1"
  },
  "AUD": {
    "name": "Australian Dollars",
    "symbol": "$",
    "rate_usd": "1"
  },
  "CHF": {
    "name": "Swiss Francs",
    "symbol": "&#8366;",
    "rate_usd": "1"
  },
  "SGD" : {
    "name": "Singapore Dollars",
    "symbol": "$",
    "rate_usd": "1"
  },
  "EUR": {
    "name": "Euro",
    "symbol": "€",
    "rate_usd": "1"
  },
  "USD": {
    "name": "US Dollars",
    "symbol": "$",
    "rate_usd": "1"
  }
});

if(!localStorage.from_to) {
  localStorage.from_to = JSON.stringify({ "from": "JPY", "to": "AUD" });
}

window.from_to = JSON.parse(localStorage.from_to);
window.currencies = JSON.parse(localStorage.currencies);