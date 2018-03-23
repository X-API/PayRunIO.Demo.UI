const Handlebars = require("handlebars");

module.exports = (address) => {
    if (address) {
        let parts = [
            address.Address1, 
            address.Address2, 
            address.Address3, 
            address.Address4, 
            address.Country, 
            address.Postcode
        ].filter(part => part !== null && part !== undefined && part.trim().length > 0);

        return new Handlebars.SafeString(parts.join("<br />"));
    }

    return "";
};