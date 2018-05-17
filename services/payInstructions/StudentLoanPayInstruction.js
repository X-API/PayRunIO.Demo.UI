const BaseInstruction = require("./BaseInstruction");

module.exports = class StudentLoanPayInstruction extends BaseInstruction {
    get name() {
        return "Student Loan";
    }

    get canInstructionsOverlap() {
        return true;
    }
};