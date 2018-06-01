const Handlebars = require("handlebars");
const moment = require("moment");

module.exports = (v1, v2, context, options) => {
    let date1 = moment(v1);
    let date2 = moment(v2);

    if (date1 > date2) {
        return options.fn(context)
    }

    return options.inverse(context);
};