const BaseInstruction = require("../BaseInstruction");

module.exports = class AoePayInstruction extends BaseInstruction {
    get name() {
        return "Student Loan YTD";
    }

    get canInstructionsOverlap() {
        return true;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (cleanBody.IsAdjustment && cleanBody.IsAdjustment.toLowerCase() === "on") {
            cleanBody.IsAdjustment = true;
        }
        else {
            cleanBody.IsAdjustment = false;
        }

        return cleanBody;
    }
};