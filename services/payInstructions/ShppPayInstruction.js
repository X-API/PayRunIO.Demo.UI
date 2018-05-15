const AbsencePayInstruction = require("./AbsencePayInstruction");

module.exports = class ShppPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Shared Parental Leave and Pay";
    }
};