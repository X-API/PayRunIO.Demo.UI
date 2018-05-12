const BaseInstruction = require("./BaseInstruction");

module.exports = class StudentLoanPayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return true;
    }
};