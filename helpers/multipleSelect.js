const $ = require("cheerio");

module.exports = (value, options) => {
    let $el = $("<select />").html(options.fn(this));

    if (value) {
        for (let item of value.split(" ")) {
            $el.find(`[value="${item}"]`).attr({
                "selected": "selected"
            });
        }
    }

    return $el.html();
};