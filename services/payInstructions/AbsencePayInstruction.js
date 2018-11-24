const BaseInstruction = require("./BaseInstruction");

module.exports = class AbsencePayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return true;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        cleanBody.StatutoryOffset = cleanBody.StatutoryOffset && cleanBody.StatutoryOffset.toLowerCase() === "on";

        return cleanBody;
    }
};