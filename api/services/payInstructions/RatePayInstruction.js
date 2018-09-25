const BaseInstruction = require("./BaseInstruction");

module.exports = class RatePayInstruction extends BaseInstruction {
    get name() {
        return "Rate";
    }
};