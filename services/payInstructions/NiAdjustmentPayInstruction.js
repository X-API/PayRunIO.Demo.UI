const NiPayInstruction = require("./NiPayInstruction");

module.exports = class NiAdjustmentPayInstruction extends NiPayInstruction {
    get name() {
        return "NI adjustment";
    }
};