const BaseInstruction = require("../base-instruction");

module.exports = class PrimitivePayInstruction extends BaseInstruction {
    get name() {
        return "Primitive";
    }
};