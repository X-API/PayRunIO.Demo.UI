const Handlebars = require("handlebars");
const moment = require("moment");

module.exports = (minStartDate) => {
    if (minStartDate) {
        let date = moment(minStartDate);

        return new Handlebars.SafeString(`min="${date.format("YYYY-MM-DD")}"`);
    }

    return "";
};