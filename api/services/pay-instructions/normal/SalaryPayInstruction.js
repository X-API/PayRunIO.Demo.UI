const BaseInstruction = require("../base-instruction");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    get name() {
        return "Salary";
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
            RoundingOption: cleanBody.RoundingOption
        };
    }
};