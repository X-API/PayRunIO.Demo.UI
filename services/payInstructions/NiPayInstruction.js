const BaseInstruction = require("./BaseInstruction");

module.exports = class NiPayInstruction extends BaseInstruction {
    get name() {
        return "NI";
    }

    get canInstructionsOverlap() {
        return true;
    }
};