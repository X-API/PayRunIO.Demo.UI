const $ = require("cheerio");

module.exports = (value, options) => {
    let $el = $("<select />").html(options.fn(this));

    if (value) {
        let items = Array.isArray(value) ? value : value.split(" ");

        for (let item of items) {
            $el.find(`[value="${item}"]`).attr({
                "selected": "selected"
            });
        }
    }

    return $el.html();
};