const BaseInstruction = require("./BaseInstruction");

module.exports = class NiPayInstruction extends BaseInstruction {
    get name() {
        return "National Insurance";
    }
};