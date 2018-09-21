const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");

module.exports = class StudentLoanYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Student Loan YTD";
    }
};