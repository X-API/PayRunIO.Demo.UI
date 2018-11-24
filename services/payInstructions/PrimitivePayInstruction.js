const BaseInstruction = require("./BaseInstruction");

module.exports = class PrimitivePayInstruction extends BaseInstruction {
    get name() {
        return "Primitive";
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

            Code: cleanBody.Code,
            Value: cleanBody.Value
        };
    }     
};