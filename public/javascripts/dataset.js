if(!localStorage.currencies) {
  localStorage.currencies = JSON.stringify({
    "AUD": {
      "name": "Australian Dollars",
      "symbol": "$",
      "rate_usd": "1"
    },
    "JPY": {
      "name": "Japanese Yen",
      "symbol": "¥",
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
}


window.currencies = JSON.parse(localStorage.currencies);