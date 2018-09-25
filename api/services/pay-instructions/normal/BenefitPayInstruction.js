const BaseInstruction = require("../base-instruction");

module.exports = class BenefitPayInstruction extends BaseInstruction {
    get name() {
        return "Benefit";
    }
};