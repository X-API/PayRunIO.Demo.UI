const BaseInstruction = require("../BaseInstruction");

module.exports = class BaseYtdPayInstruction extends BaseInstruction {
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