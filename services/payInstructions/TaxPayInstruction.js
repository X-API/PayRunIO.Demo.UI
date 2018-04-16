const BaseInstruction = require("./BaseInstruction");

module.exports = class TaxPayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return false;
    }

    parseForApi(body) {
        return super.parseForApi(body);
    }
};