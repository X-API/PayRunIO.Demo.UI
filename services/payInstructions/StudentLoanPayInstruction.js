const BaseInstruction = require("./BaseInstruction");

module.exports = class StudentLoanPayInstruction extends BaseInstruction {
    get name() {
        return "Student loan";
    }

    get canInstructionsOverlap() {
        return true;
    }
};