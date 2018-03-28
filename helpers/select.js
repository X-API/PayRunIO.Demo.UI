const $ = require("cheerio");

module.exports = (value, options) => {
    let $el = $("<select />").html(options.fn(this));

    $el.find(`[value="${value}"]`).attr({
        "selected": "selected"
    });

    return $el.html();
};