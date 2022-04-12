const Validator = require('./validator.js').Validator;
const ResponseMaker = require('./responseMaker').ResponseMaker;
const Settings = require('./settings.js').Settings;

const axios = require('axios');

const LRU = require('lru-cache');
const options = Settings.lru;
const lruCache = new LRU(options);

const CurrencyConverter = {
    
    /**
     * Main function to convert currency
     * 
     * @param {object} param0 
     * @returns response object
     */
    convert : async({baseCurrency, quoteCurrency, baseAmount}) => {

        if (
            Validator.validateCurrency(baseCurrency)
            && Validator.validateCurrency(quoteCurrency)
            && Validator.validateAmount(baseAmount)
        ) {
            let rateData = await CurrencyConverter.getRates(baseCurrency, quoteCurrency);

            // if there was any type of error - just pass everything as-is to the caller
            if (rateData.error) {
                return ResponseMaker.prepareResponseObjectFromDataObject(rateData);
            }

            let rate = rateData.data.rate.toFixed(3);

            // prepare convertation data and pass it to the caller
            let convertationData = {
                exchangeRate : rate,
                quoteAmount : (parseInt(baseAmount) * parseFloat(rate)).toFixed(0)
            }

            // store rate to cache
            CurrencyConverter.storeCachedRates(baseCurrency, quoteCurrency, rateData.data.rate);

            return ResponseMaker.prepareResponseObject(false, convertationData);
        }

        let errorResponse = {
            error : true,
            data : {},
            msg : "One or more of passed parameters haven't passed validation."
        }

        return ResponseMaker.prepareResponseObjectFromDataObject(errorResponse);
    },

    /**
     * This function tries to get cached rates first and, in case of failure,
     * connects to web to get the latest rates possible
     * 
     * @param {string} baseCurrency 
     * @param {string} quoteCurrency 
     * @returns {object} response object
     */
    getRates : async(baseCurrency, quoteCurrency) => {
        // check for cached rates. if not available - get rates from online
        let cachedRates = CurrencyConverter.getCachedRates(baseCurrency, quoteCurrency);

        // try to get cached data in case no cached data was obtained
        if (cachedRates.error) {

            try {
                const response = await axios.get(
                    "https://api.exchangerate-api.com/v4/latest/" + baseCurrency.toUpperCase()
                );

                let responseData = {};

                if (response.data.rates[quoteCurrency.toUpperCase()] !== undefined) {
                    responseData = {
                        error : false,
                        data : { rate : response.data.rates[quoteCurrency.toUpperCase()] }
                    };
                } else {
                    responseData = {
                        error : true,
                        data : {},
                        msg : "Conversion pair hasn't been found."
                    }
                }

                return ResponseMaker.prepareResponseObjectFromDataObject(responseData);

            } catch (error) {
                let responseData = {
                    error : true,
                    data : {},
                    msg : "There was an error while processing your request. Please try again later."
                };

                return ResponseMaker.prepareResponseObjectFromDataObject(responseData);
            }
        }

        return cachedRates;
    },

    /**
     * Trying to get cached data
     * 
     * @param {string} baseCurrency 
     * @param {string} quoteCurrency 
     * @returns {object} response object
     */
    getCachedRates : (baseCurrency, quoteCurrency) => {
        let responseData = {};
        let cacheKey = (baseCurrency + quoteCurrency).toUpperCase();
        let cachedValue = lruCache.get(cacheKey);
        if (cachedValue === undefined) {
            responseData = {
                error : true,
                data : {},
                msg : "This pair is not cached"
            };
        } else {
            responseData = {
                error : false,
                data : { rate : cachedValue }
            }
        }

        return ResponseMaker.prepareResponseObjectFromDataObject(responseData);
    },

    /**
     * Store rate data to cache
     * 
     * @param {string} baseCurrency 
     * @param {string} quoteCurrency 
     * @param {int} rate
     */
    storeCachedRates : (baseCurrency, quoteCurrency, rate) => {
        let cacheKey = (baseCurrency + quoteCurrency).toUpperCase();
        lruCache.set(cacheKey, rate);
    }
};

module.exports = {
    CurrencyConverter
}
