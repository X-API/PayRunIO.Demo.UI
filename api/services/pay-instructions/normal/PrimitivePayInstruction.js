const BaseInstruction = require("../base-instruction");

module.exports = class PrimitivePayInstruction extends BaseInstruction {
    get name() {
        return "Primitive";
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