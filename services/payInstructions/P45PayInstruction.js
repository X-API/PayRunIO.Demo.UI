const BaseInstruction = require("./BaseInstruction");

module.exports = class P45PayInstruction extends BaseInstruction {
    get name() {
        return "P45";
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

            TaxablePay: cleanBody.TaxablePay,
            TaxPaid: cleanBody.TaxPaid,
            TaxCode: cleanBody.TaxCode,
            TaxBasis: cleanBody.TaxBasis,
            StudentLoan: cleanBody.StudentLoan,
            PayFrequency: cleanBody.PayFrequency,
            LeavingDate: cleanBody.LeavingDate,
            PreviousEmployerPayeRef: cleanBody.PreviousEmployerPayeRef
        };
    }     
};