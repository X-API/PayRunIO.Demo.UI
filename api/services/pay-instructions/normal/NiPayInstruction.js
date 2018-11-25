const BaseInstruction = require("../base-instruction");

module.exports = class NiPayInstruction extends BaseInstruction {
    get name() {
        return "National Insurance";
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