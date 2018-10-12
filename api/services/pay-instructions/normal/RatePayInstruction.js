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

        return super.parseForApi(copy);        
    }
};