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

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag
        };
    }     
};