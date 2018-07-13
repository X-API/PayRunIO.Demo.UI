const AbsencePayInstruction = require("./AbsencePayInstruction");

module.exports = class SspPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Statutory Sick Pay";
    }

    
};