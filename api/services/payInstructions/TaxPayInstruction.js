const BaseInstruction = require("./BaseInstruction");

module.exports = class TaxPayInstruction extends BaseInstruction {
    get name() {
        return "Tax";
    }
};