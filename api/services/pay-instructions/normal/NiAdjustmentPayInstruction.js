const NiPayInstruction = require("./NiPayInstruction");

module.exports = class NiAdjustmentPayInstruction extends NiPayInstruction {
    get name() {
        return "NI Adjustment";
    }

    async extendViewModel(ctx, vm) {
        let extendedViewModel = await super.extendViewModel(ctx, vm);

        extendedViewModel.NiLetter = "A";
        extendedViewModel.TaxYear = "2015";
        extendedViewModel.DirCalculationMethod = "Off";

        return extendedViewModel;
    }

    parseForApi(body) {
        let copy = JSON.parse(JSON.stringify(body));

        copy = Object.assign({
            Periods: copy.Periods,
            DirCalculationMethod: copy.DirCalculationMethod
        }, copy);

        let cleanBody = super.parseForApi(copy);

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