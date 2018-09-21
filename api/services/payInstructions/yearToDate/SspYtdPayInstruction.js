const BaseAbsenceYtdPayInstruction = require("./BaseAbsenceYtdPayInstruction");

module.exports = class SppYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Statutory Sick Pay YTD";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return { 
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            AbsenceStart: cleanBody.AbsenceStart,
            AbsenceEnd: cleanBody.AbsenceEnd,
            Value: cleanBody.Value,
            AverageWeeklyEarnings: cleanBody.AverageWeeklyEarnings,
            WeeksUsed: cleanBody.WeeksUsed,
            IsAdjustment: cleanBody.IsAdjustment,            
            WaitingDaysServed: cleanBody.WaitingDaysServed,
            QualifyingDays: cleanBody.QualifyingDays,
            Description: cleanBody.Description,
            MinStartDate: cleanBody.MinStartDate,
            InstructionType: cleanBody.InstructionType,
            EmployerId: cleanBody.EmployerId
        };
    }    
};