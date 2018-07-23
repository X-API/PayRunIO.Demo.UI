const AbsencePayInstruction = require("./AbsencePayInstruction");

module.exports = class SspPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Statutory Sick Pay";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            AbsenceStart: cleanBody.AbsenceStart,
            AbsenceEnd: cleanBody.AbsenceEnd,
            StatutoryOffset: cleanBody.StatutoryOffset,
            AverageWeeklyEarningOverride: cleanBody.AverageWeeklyEarningOverride,            
            Description: cleanBody.Description,
            MinStartDate: cleanBody.MinStartDate,
            InstructionType: cleanBody.InstructionType,
            EmployerId: cleanBody.EmployerId
        };
    }    
};