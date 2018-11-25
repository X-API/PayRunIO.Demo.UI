const BaseInstruction = require("../base-instruction");

module.exports = class RatePayInstruction extends BaseInstruction {
    get name() {
        return "Rate";
    }

    parseForApi(body) {
        let copy = JSON.parse(JSON.stringify(body));

        copy = Object.assign({
            Rate: copy.Rate,
            RateUoM: copy.RateUoM,
            Units: copy.Units
        }, copy);

        copy.Code = null;

        let cleanBody = super.parseForApi(copy);
        
        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            Code: cleanBody.Code,
            Rate: cleanBody.Rate,
            RateUoM: cleanBody.RateUoM,
            Units: cleanBody.Units,
            RoundingOption: cleanBody.RoundingOption
        };        
    }
};