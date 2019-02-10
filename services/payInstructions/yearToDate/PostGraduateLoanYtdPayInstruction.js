const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");

module.exports = class PostGraduateLoanYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Post Graduate Loan YTD";
    }
};