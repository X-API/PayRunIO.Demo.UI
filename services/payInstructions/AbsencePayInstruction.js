const BaseInstruction = require("./BaseInstruction");
const FormUtils = require("../form-utils");

module.exports = class AbsencePayInstruction extends BaseInstruction {
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