const AbsencePayInstruction = require("./base-absence-pay-instruction");

module.exports = class SmpPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Statutory Maternity Pay";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            AbsenceStart: cleanBody.AbsenceStart,
            AbsenceEnd: cleanBody.AbsenceEnd,
            StatutoryOffset: cleanBody.StatutoryOffset,
            
            AverageWeeklyEarningOverride: cleanBody.AverageWeeklyEarningOverride,
            PayAsLumpSum: cleanBody.PayAsLumpSum,
            PayPartWeek: cleanBody.PayPartWeek,
            BabyDueDate: cleanBody.BabyDueDate,
            BabyBornDate: cleanBody.BabyBornDate,
            Stillbirth: cleanBody.Stillbirth,
            MinStartDate: cleanBody.MinStartDate,
            InstructionType: cleanBody.InstructionType,
            EmployerId: cleanBody.EmployerId
        };
    }    
};