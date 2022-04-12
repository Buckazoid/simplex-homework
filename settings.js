Settings = {
    lru : {
        ttl : 60 * 1000,
        max : 20,
        updateAgeOnGet: true
    },
    allowedCurrencies : ["USD", "EUR", "GBP", "ILS"]
}

module.exports = {
    Settings
}