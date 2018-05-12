const BaseInstruction = require("./BaseInstruction");

module.exports = class PrimitivePayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return true;
    }
};