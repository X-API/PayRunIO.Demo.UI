const BaseInstruction = require("./BaseInstruction");

module.exports = class NiPayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return true;
    }

    parseForApi(body) {
        return super.parseForApi(body);
    }
};