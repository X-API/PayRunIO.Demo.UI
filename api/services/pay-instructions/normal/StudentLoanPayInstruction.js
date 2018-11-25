const BaseInstruction = require("../base-instruction");

module.exports = class StudentLoanPayInstruction extends BaseInstruction {
    get name() {
        return "Student Loan";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            StudentLoanCalculationMethod: cleanBody.StudentLoanCalculationMethod
        };
    }    
};