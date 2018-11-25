const BaseInstruction = require("../base-instruction");

module.exports = class TaxPayInstruction extends BaseInstruction {
    get name() {
        return "Tax";
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