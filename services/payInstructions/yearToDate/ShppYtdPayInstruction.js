const BaseAbsenceYtdPayInstruction = require("./BaseAbsenceYtdPayInstruction");

module.exports = class SppYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Shared Parental Pay YTD";
    }
};