const BaseInstruction = require("./BaseInstruction");

module.exports = class AbsencePayInstruction extends BaseInstruction {
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