const BaseAbsenceYtdPayInstruction = require("./BaseAbsenceYtdPayInstruction");

module.exports = class ShppYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Shared Parental Pay YTD";
    }
};