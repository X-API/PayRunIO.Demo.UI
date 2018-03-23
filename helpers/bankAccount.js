const Handlebars = require("handlebars");

module.exports = (account) => {
    if (account) {
        let parts = [
            account.AccountName,
            account.AccountNumber,
            account.SortCode
        ].filter(part => part !== null && part !== undefined && part.trim().length > 0);

        return new Handlebars.SafeString(parts.join("<br />"));
    }

    return "";
};