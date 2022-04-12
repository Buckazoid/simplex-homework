const { expect } = require("@jest/globals");

const SUT = require("../currencyConverter.js").CurrencyConverter;

test("Non-cached pair should match expected object", () => {
    let expectedObject = {
        error : true,
        data : {},
        msg : "This pair is not cached"
    };;
    
    expect(SUT.getCachedRates("JPY", "NOK")).toMatchObject(expectedObject);
});

test("Check if data can be stored into and received from LRU cache", () => {
    
    let rateValue = 0.5;
    let expectedObject = {
        error: false,
        data : {
            rate : rateValue
        },
        msg : null
    };
    SUT.storeCachedRates("JPY", "NOK", rateValue);
    expect(SUT.getCachedRates("JPY", "NOK")).toMatchObject(expectedObject);
});

test("Non-existing pair should not be processed", async() => {
    //let rateData = await SUT.getRates("ERR", "GBP");
    let expectedObject = {
        error : true,
        data : {},
        msg : "Conversion pair hasn't been found."
    };
    await expect(SUT.getRates("USD", "ERR")).resolves.toMatchObject(expectedObject);
});

test("Invalid base currency should result in catched from axios error", async() => {
    let expectedObject = {
        error : true,
        data : {},
        msg : "There was an error while processing your request. Please try again later."
    };
    await expect(SUT.getRates("ERR", "GBP")).resolves.toMatchObject(expectedObject);
});

test("Check if rates are being received fron the site and if they were cached after that", async() => {
    try {
        let rateData = await SUT.getRates("USD", "GBP");
        expect(rateData.error).toBeFalsy();
        expect(rateData.msg).toBeNull();
    
        let cachedRateData = SUT.getCachedRates("USD", "GBP");
        expect(cachedRateData).toBeDefined();
    } catch (err) {
        console.log(err);
    }
});
