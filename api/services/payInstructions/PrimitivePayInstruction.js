const BaseInstruction = require("./BaseInstruction");

module.exports = class PrimitivePayInstruction extends BaseInstruction {
    get name() {
        return "Primitive";
    }

    get canInstructionsOverlap() {
        return true;
    }
};