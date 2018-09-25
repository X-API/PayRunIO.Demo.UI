const BaseInstruction = require("./BaseInstruction");

module.exports = class AoePayInstruction extends BaseInstruction {
    get name() {
        return "Attachment of Earnings";
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (cleanBody.ClaimAdminFee && cleanBody.ClaimAdminFee.toLowerCase() === "on") {
            cleanBody.ClaimAdminFee = true;
        }
        else {
            cleanBody.ClaimAdminFee = false;
        }

        return cleanBody;
    }
};