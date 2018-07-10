const BaseInstruction = require("../BaseInstruction");

module.exports = class PrimitiveYtdPayInstruction extends BaseInstruction {
    get name() {
        return "Primitive YTD";
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