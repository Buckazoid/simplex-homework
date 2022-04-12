const Settings = require('./settings').Settings;

const Validator = {
    /**
     * Make sure currency is of allowed types only
     * 
     * @param {string} currency currency in ISO3 representation
     * @returns {boolean}
     */
    validateCurrency : (currency) => {
        let supportedCurrencies = Settings.allowedCurrencies;
        if (supportedCurrencies.includes(currency.toUpperCase())) {
            return true;
        }
        return false;
    },

    /**
     * Make sure we have 
     * 
     * @param {int} amount amount in cents
     * @returns {boolean}
     */
    validateAmount : (amount) => {
        if (amount > 0) {
            return true;
        }
        return false;
    }
}

module.exports = {
    Validator
};