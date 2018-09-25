const BaseInstruction = require("../base-instruction");

module.exports = class NiPayInstruction extends BaseInstruction {
    get name() {
        return "National Insurance";
    }
};