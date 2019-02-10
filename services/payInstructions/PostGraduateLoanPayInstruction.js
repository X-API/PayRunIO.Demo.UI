const BaseInstruction = require("./BaseInstruction");

module.exports = class PostGraduateLoanPayInstruction extends BaseInstruction {
    get name() {
        return "Post Graduate Loan";
    }

    get canInstructionsOverlap() {
        return true;
    }


    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,
        };
    }      
};