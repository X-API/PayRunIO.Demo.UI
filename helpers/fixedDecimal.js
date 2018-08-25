module.exports = (input, noOfDecimalPoints) => {
    if (input) {
        return parseFloat(input).toFixed(noOfDecimalPoints);
    }

    return "";
};