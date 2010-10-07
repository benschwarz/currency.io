localStorage.currencies = localStorage.currencies || JSON.stringify({
  "EUR": {
    "name": "Euro",
    "symbol": "€",
    "rate_usd": "0"
  },
  "GBP": {
    "name": "British Pound",
    "symbol": "£",
    "rate_usd": "0"
  },
  "JPY": {
    "name": "Japanese Yen",
    "symbol": "¥",
    "rate_usd": "0"
  },
  "CHF": {
    "name": "Swiss Francs",
    "symbol": "chf",
    "rate_usd": "0"
  },
  "CAD": {
    "name": "Canadian Dollars",
    "symbol": "$",
    "rate_usd": "0"
  },
  "AUD": {
    "name": "Australian Dollars",
    "symbol": "$",
    "rate_usd": "0"
  },
  "SGD": {
    "name": "Singapore Dollars",
    "symbol": "$",
    "rate_usd": "0"
  },
  "HKD": {
    "name": "Hong Kong Dollars",
    "symbol": "$",
    "rate_usd": "0"
  },
  "NZD": {
    "name": "New Zealand Dollars",
    "symbol": "$",
    "rate_usd": "0"
  }
});

localStorage.from_to = localStorage.from_to || JSON.stringify({ from: "JPY", to: "AUD" });

window.from_to = JSON.parse(localStorage.from_to);
window.currencies = JSON.parse(localStorage.currencies);