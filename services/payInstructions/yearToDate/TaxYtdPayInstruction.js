const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");

module.exports = class TaxYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Tax YTD";
    }
};