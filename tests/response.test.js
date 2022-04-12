const { expect } = require("@jest/globals");

const SUT = require("../responseMaker.js").ResponseMaker;

test("Response should be of object containing error, data and msg parameters", () => {

    let error = false;
    let data = {};
    let msg = "message";

    let dataObject = {
        error : error,
        data : data,
        msg : msg
    };

    expect(SUT.prepareResponseObjectFromDataObject(dataObject)).toMatchObject(dataObject);
    expect(SUT.prepareResponseObject(error, data, msg)).toMatchObject(dataObject);
});