const BaseYtdPayInstruction = require("./base-ytd-pay-instruction");

module.exports = class StudentLoanYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Student Loan YTD";
    }
};