const BaseInstruction = require("./BaseInstruction");

module.exports = class TaxPayInstruction extends BaseInstruction {
    get name() {
        return "Tax";
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
            PayLineTag: cleanBody.PayLineTag,

            TaxBasis: cleanBody.TaxBasis,
            TaxCode: cleanBody.TaxCode,
            WithholdRefund: cleanBody.WithholdRefund && cleanBody.WithholdRefund.toLowerCase() === "on"
        };
    }     
};