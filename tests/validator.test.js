const { expect } = require("@jest/globals");

const SUT = require("../validator.js").Validator;
const Settings = require("../settings.js").Settings;

test("Currency has to be of types described in settings.js file any other should result as false", () => {
    for (currency in Settings.allowedCurrencies) {
        expect(SUT.validateCurrency(currency)).toBeTruthy;
    }
    expect(SUT.validateCurrency("JPY")).toBeFalsy;
});

test("Amount of cents has to be greater than zero", () => {
    expect(SUT.validateAmount(100)).toBeTruthy();
    expect(SUT.validateAmount(0)).toBeFalsy();
    expect(SUT.validateAmount(-1)).toBeFalsy();
});