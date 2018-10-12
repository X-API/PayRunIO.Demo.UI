const BaseInstruction = require("../base-instruction");

module.exports = class StudentLoanPayInstruction extends BaseInstruction {
    get name() {
        return "Student Loan";
    }
};