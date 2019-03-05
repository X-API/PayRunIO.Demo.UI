const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");

module.exports = class RateYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Rate YTD";
    }
};