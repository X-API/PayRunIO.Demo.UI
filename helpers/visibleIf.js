const Handlebars = require("handlebars");

module.exports = (condition) => {
    return condition? "display-block" : "display-none";
};