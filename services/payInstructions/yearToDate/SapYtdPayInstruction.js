const BaseAbsenceYtdPayInstruction = require("./BaseAbsenceYtdPayInstruction");

module.exports = class SapYtdPayInstruction extends BaseAbsenceYtdPayInstruction {
    get name() {
        return "Statutory Adoption Pay YTD";
    }

    async extendViewModel(ctx, vm) {
        let evm = await super.extendViewModel(ctx, vm);

        if (vm.KeepInTouchDays) {
            evm.CoalescedKeepInTouchDays = vm.KeepInTouchDays.Date.join("|");
        }
        else {
            evm.CoalescedKeepInTouchDays = "";
        }

        return evm;
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
            KeepInTouchDays: {
                Date: cleanBody.KeepInTouchDays.split("|")
            },
            MinStartDate: cleanBody.MinStartDate,
            InstructionType: cleanBody.InstructionType,
            EmployerId: cleanBody.EmployerId
        };
        
        return output;
    }
};