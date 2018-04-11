const BaseInstruction = require("./BaseInstruction");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return false;
    }
};