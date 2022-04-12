const ResponseMaker = require('./responseMaker.js').ResponseMaker;
const CurrencyConverter = require('./currencyConverter.js').CurrencyConverter;

const http = require('http');
const url = require('url');

/**
 * Create request listener
 * 
 * @param {object} req 
 * @param {object} res 
 */
reqListener = async(req, res) => {

    let urlQuery = url.parse(req.url, true);
    let params = urlQuery.query;
    let returnObject = {};

    if (
        params.baseCurrency !== undefined
        && params.quoteCurrency !== undefined
        && params.baseAmount !== undefined
        ) {
        // let's make sure base amount is an integer
        params.baseAmount = parseInt(params.baseAmount);
        // do some convertation
        returnObject = await CurrencyConverter.convert(params);
    } else {
        let responseData = {
            error : true,
            data : {},
            msg : "One or more parameters are missing. Please check your query request."
        };
        returnObject = ResponseMaker.prepareResponseObjectFromDataObject(responseData);
    }

    // set headers and return data
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(returnObject));
    res.end();
}

// define and init server
const server = http.createServer(reqListener);
server.listen(3000);
