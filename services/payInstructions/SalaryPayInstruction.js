const BaseInstruction = require("./BaseInstruction");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    get name() {
        return "Salary";
    }

    get canInstructionsOverlap() {
        return false;
    }
};