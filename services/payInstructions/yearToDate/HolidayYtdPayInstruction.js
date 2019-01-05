const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");

module.exports = class HolidayYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Holiday YTD";
    }
};