const BaseAbsenceYtdPayInstruction = require("./base-absence-ytd-pay-instruction");

module.exports = class ShppYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Shared Parental Pay YTD";
    }
};