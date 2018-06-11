const BaseInstruction = require("./BaseInstruction");

module.exports = class PensionPayInstruction extends BaseInstruction {
    get name() {
        return "Pension";
    }

    get canInstructionsOverlap() {
        return true;
    }
};