const BaseAbsenceYtdPayInstruction = require("./BaseAbsenceYtdPayInstruction");

module.exports = class SmpYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Statutory Maternity Pay YTD";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        let output = {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            AbsenceStart: cleanBody.AbsenceStart,
            AbsenceEnd: cleanBody.AbsenceEnd,
            Value: cleanBody.Value,
            AverageWeeklyEarnings: cleanBody.AverageWeeklyEarnings,
            WeeksUsed: cleanBody.WeeksUsed,
            Description: cleanBody.Description,
            IsAdjustment: cleanBody.IsAdjustment,
            //KeepInTouchDays: cleanBody.KeepInTouchDays.split("|"),
            MinStartDate: cleanBody.MinStartDate,
            InstructionType: cleanBody.InstructionType,
            EmployerId: cleanBody.EmployerId
        };

        console.log(output);
        
        return output;
    }
};