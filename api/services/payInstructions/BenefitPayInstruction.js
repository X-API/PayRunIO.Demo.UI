const BaseInstruction = require("./BaseInstruction");

module.exports = class BenefitPayInstruction extends BaseInstruction {
    get name() {
        return "Benefit";
    }
};