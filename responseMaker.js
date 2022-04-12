const ResponseMaker = {
    /**
     * Wrapper for prepareResponseObject function for us to be able to pass whole object here with error, data and msg properties
     * 
     * @param {object} param0 
     * @returns formatted response object
     */
    prepareResponseObjectFromDataObject : ({error, data, msg}) => {
        return ResponseMaker.prepareResponseObject(error, data, msg);
    },

    /**
     * Prepare response object
     * 
     * @param {boolean} error
     * @param {object} data
     * @param {string} msg (can be omitted), usually used only when error is positive
     * @returns {object} formatted respomse object
     */
    prepareResponseObject : (error, data, msg) => {
        msg = (msg === undefined) ? null : msg;
        return {
            error: error,
            data: data,
            msg: msg
        };
    }
}

module.exports = {
    ResponseMaker
}