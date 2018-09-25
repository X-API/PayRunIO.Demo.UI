const BaseInstruction = require("../base-instruction");

module.exports = class AoePayInstruction extends BaseInstruction {
    get name() {
        return "Attachment of Earnings";
    }
};