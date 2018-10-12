const BaseInstruction = require("../base-instruction");

module.exports = class TaxPayInstruction extends BaseInstruction {
    get name() {
        return "Tax";
    }
};