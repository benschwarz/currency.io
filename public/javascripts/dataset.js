if(!localStorage.currencies) {
  localStorage.currencies = JSON.stringify({
    "AUD": {
      "name": "Australian Dollars",
      "symbol": "$",
      "rate_usd": "0"
    },
    "JPY": {
      "name": "Japanese Yen",
      "symbol": "¥",
      "rate_usd": "0"
    },
    "CHF": {
      "name": "Swiss Francs",
      "symbol": "&#8366;",
      "rate_usd": "0"
    },
    "SGD" : {
      "name": "Singapore Dollars",
      "symbol": "S$",
      "rate_usd": "0"
    }
  });
}


window.currencies = JSON.parse(localStorage.currencies);