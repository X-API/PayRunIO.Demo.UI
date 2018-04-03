const Handlebars = require("handlebars");
const moment = require('moment');

module.exports = () => {
    let startYear = moment().month() < 3 ? moment().year() - 1: moment().year();
    let years = [];

    for (let i = 0; i < 2; i++) {
        let year = startYear - i;

        years.push({
            value: year - 1,
            text: `${year - 1} / ${year}`
        });
    }

    let html = "";

    for (let year of years) {
        html += `<option value="${year.value}">${year.text}</option>`
    }

    return new Handlebars.SafeString(html);
};