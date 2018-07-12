const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");

module.exports = class PrimitiveYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Primitive YTD";
    }
};