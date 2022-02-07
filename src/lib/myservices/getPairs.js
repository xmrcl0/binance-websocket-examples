const fetch = require('cross-fetch')

const getPairs = (quoteAsset = 'USDT') => {
  return new Promise((resolve, reject) => {
    var url = 'https://api.binance.com/api/v3/exchangeInfo'
    var pairs = []
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data['symbols'].forEach(element => {
          if (element['quoteAsset'] == quoteAsset.toUpperCase() && element['status'] == 'TRADING') {
            pairs.push(element['symbol'])
          }
        });
        if (pairs.length != 0) {
          resolve(pairs)
        }
        else {
          reject(Error('No coins found'))
        }
      });
  });
}

export default getPairs;