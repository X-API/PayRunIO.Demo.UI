const Handlebars = require("handlebars");
const moment = require("moment");

module.exports = (date) => {
    if (date) {
        let parsedDate = moment(date);

        return parsedDate.format("YYYY-MM-DD HH:mm:ss");
    }

    return "";
};