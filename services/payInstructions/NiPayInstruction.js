const BaseInstruction = require("./BaseInstruction");

module.exports = class NiPayInstruction extends BaseInstruction {
    get name() {
        return "National Insurance";
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

            DirCalculationMethod: cleanBody.DirCalculationMethod,
            NiLetter: cleanBody.NiLetter
        };
    }    
};