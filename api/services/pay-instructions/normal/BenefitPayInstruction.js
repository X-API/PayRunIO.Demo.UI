const BaseInstruction = require("../base-instruction");

module.exports = class BenefitPayInstruction extends BaseInstruction {
    get name() {
        return "Benefit";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,
            
            Code: cleanBody.Code,
            TotalCost: cleanBody.TotalCost,
            EmployeeContribution: cleanBody.EmployeeContribution,
            CashEquivalent: cleanBody.CashEquivalent,
            AccountingMethod: cleanBody.AccountingMethod,
            BenefitEndDate: cleanBody.BenefitEndDate
        };
    }     
};