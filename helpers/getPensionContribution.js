module.exports = (cash, percent) => {
    if (cash !== null && cash !== undefined) {
        return "£" + cash;
    }

    if (percent !== null && percent !== undefined) {
        return percent + "%";
    }

    return "";
};