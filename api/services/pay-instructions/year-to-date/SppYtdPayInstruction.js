const BaseAbsenceYtdPayInstruction = require("./base-absence-ytd-pay-instruction");

module.exports = class SppYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Statutory Paternity Pay YTD";
    }
};