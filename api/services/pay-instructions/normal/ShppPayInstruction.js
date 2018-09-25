const AbsencePayInstruction = require("./base-absence-pay-instruction");

module.exports = class ShppPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Shared Parental Leave";
    }
};