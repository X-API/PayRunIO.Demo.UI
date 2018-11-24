const AbsencePayInstruction = require("./AbsencePayInstruction");

module.exports = class ShppPayInstruction extends AbsencePayInstruction {
    get name() {
        return "Shared Parental Leave";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (cleanBody.PayAsLumpSum && cleanBody.PayAsLumpSum.toLowerCase() === "on") {
            cleanBody.PayAsLumpSum = true;
        }
        else {
            cleanBody.PayAsLumpSum = false;
        }

        if (cleanBody.PayPartWeek && cleanBody.PayPartWeek.toLowerCase() === "on") {
            cleanBody.PayPartWeek = true;
        }
        else {
            cleanBody.PayPartWeek = false;
        }

        if (cleanBody.Stillbirth && cleanBody.Stillbirth.toLowerCase() === "on") {
            cleanBody.Stillbirth = true;
        }
        else {
            cleanBody.Stillbirth = false;
        }
        
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