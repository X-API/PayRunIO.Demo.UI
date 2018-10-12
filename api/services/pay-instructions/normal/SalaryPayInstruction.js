const BaseInstruction = require("../base-instruction");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    get name() {
        return "Salary";
    }
};