const BaseYtdPayInstruction = require("./base-ytd-pay-instruction");

module.exports = class PrimitiveYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Primitive YTD";
    }
};