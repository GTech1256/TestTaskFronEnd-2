export default {
  ExchangerRates: {
    exchangers: require(`./exchangerRates/exchangers.json`),
    pairs: require(`./exchangerRates/pairs.json`),
    result: require(`./exchangerRates/result.json`),
  },
  MarketRates: {
    markets: require(`./marketRates/markets.json`),
    pairs: require(`./marketRates/pairs.json`),
    result: require(`./marketRates/result.json`),
  },
  Localbitcoins: {
    countrys: require('./localBitcoins/country.json'),
    result: require('./localBitcoins/result.json')
  },
};
