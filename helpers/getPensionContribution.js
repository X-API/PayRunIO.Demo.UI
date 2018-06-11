module.exports = (cash, percent) => {
    if (cash !== null && cash !== undefined) {
        return "£" + cash.toFixed(2);
    }

    if (pecent !== null && percent !== undefined) {
        return percent.toFixed(2) + "%";
    }

    return "";
};