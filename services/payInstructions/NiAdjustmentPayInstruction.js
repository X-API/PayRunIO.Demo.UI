const NiPayInstruction = require("./NiPayInstruction");

module.exports = class NiAdjustmentPayInstruction extends NiPayInstruction {
    get name() {
        return "NI Adjustment";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            DirCalculationMethod: cleanBody.DirCalculationMethod,
            NiLetter: cleanBody.NiLetter,

            Periods: cleanBody.Periods,
            TaxYear: cleanBody.TaxYear,
            Reason: cleanBody.Reason
        };
    }
};