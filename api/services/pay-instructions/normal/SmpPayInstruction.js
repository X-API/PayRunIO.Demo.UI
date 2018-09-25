const AbsencePayInstruction = require("./base-absence-pay-instruction");

module.exports = class SmpPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Statutory Maternity Pay";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        // todo: parse KeepInTouchDays. 

        return cleanBody;
    }    
};