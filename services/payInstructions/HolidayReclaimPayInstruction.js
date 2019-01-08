const BaseInstruction = require("./BaseInstruction");

module.exports = class HolidayReclaimPayInstruction extends BaseInstruction {
    get name() {
        return "Holiday Reclaim";
    }

    get canInstructionsOverlap() {
        return false;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        cleanBody.OffsetPayment = (cleanBody.OffsetPayment !== undefined && cleanBody.OffsetPayment !== null && cleanBody.OffsetPayment.toLowerCase() === "on");
        cleanBody.IgnoreInsufficientHistory = (cleanBody.IgnoreInsufficientHistory !== undefined && cleanBody.IgnoreInsufficientHistory !== null && cleanBody.IgnoreInsufficientHistory.toLowerCase() === "on");

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            Code: cleanBody.Code,
            UnitsDepleted: cleanBody.UnitsDepleted,
            LeaveStartDate: cleanBody.LeaveStartDate,
            LeaveEndDate: cleanBody.LeaveEndDate,
            UoM: cleanBody.UoM,
            RateOverride: cleanBody.RateOverride,
            OffsetPayment: cleanBody.OffsetPayment,
            IgnoreInsufficientHistory: cleanBody.IgnoreInsufficientHistory,  
            AweExcludedPayCodes: {
                PayCode: []
            }
        };
    }     
};