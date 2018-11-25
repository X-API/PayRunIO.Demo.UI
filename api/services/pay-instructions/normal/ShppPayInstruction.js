const AbsencePayInstruction = require("./base-absence-pay-instruction");

module.exports = class ShppPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Shared Parental Leave";
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
            BabyDueDate: cleanBody.BabyDueDate,
            BabyBornDate: cleanBody.BabyBornDate,
            SmpSapWeeksTaken: cleanBody.SmpSapWeeksTaken,
            SplStartDate: cleanBody.SplStartDate,
            SplEndDate: cleanBody.SplEndDate,
            MothersDateOfDeath: cleanBody.MothersDateOfDeath
        };
    }
};