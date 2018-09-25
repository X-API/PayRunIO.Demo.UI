const BaseYtdPayInstruction = require("./base-ytd-pay-instruction");

module.exports = class TaxYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Tax YTD";
    }
};