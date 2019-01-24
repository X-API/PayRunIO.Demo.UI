const Handlebars = require("handlebars");
const moment = require("moment");

module.exports = (maxStartDate) => {
    if (maxStartDate) {
        let date = moment(maxStartDate);

        return new Handlebars.SafeString(`max="${date.format("YYYY-MM-DD")}"`);
    }

    return "";
};