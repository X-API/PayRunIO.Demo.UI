const Handlebars = require("handlebars");
const moment = require("moment");

module.exports = (progress) => {
    let parsedProgress = parseFloat(progress);

    return `${parsedProgress * 100}%;`;
};