const BaseAbsenceYtdPayInstruction = require("./BaseAbsenceYtdPayInstruction");

module.exports = class SmpYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Statutory Maternity Pay YTD";
    }
};