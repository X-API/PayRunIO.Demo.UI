const BaseInstruction = require("./BaseInstruction");

module.exports = class AbsencePayInstruction extends BaseInstruction {
    get name() {
        return "Absence";
    }

    get canInstructionsOverlap() {
        return true;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (cleanBody.StatutoryOffset && cleanBody.StatutoryOffset.toLowerCase() === "on") {
            cleanBody.StatutoryOffset = true;
        }
        else {
            cleanBody.StatutoryOffset = false;
        }

        return cleanBody;
    }
};