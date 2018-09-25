const BaseInstruction = require("../base-instruction");

module.exports = class RatePayInstruction extends BaseInstruction {
    get name() {
        return "Rate";
    }
};