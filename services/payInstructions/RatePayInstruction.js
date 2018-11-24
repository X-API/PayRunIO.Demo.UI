const BaseInstruction = require("./BaseInstruction");

module.exports = class RatePayInstruction extends BaseInstruction {
    get name() {
        return "Rate";
    }

    get canInstructionsOverlap() {
        return true;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            Code: cleanBody.Code,
            Rate: cleanBody.Rate,
            RateUoM: cleanBody.RateUoM,
            Units: cleanBody.Units,
            RoundingOption: cleanBody.RoundingOption
        };
    }     
};