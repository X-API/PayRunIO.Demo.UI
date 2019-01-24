const BaseInstruction = require("./BaseInstruction");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    get name() {
        return "Salary";
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

            AnnualSalary: cleanBody.AnnualSalary,
            ProRataMethod: cleanBody.ProRataMethod,
            RoundingOption: cleanBody.RoundingOption,
            Code: cleanBody.Code
        };
    }    
};