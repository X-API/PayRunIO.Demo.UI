const FormUtils = require("./form-utils");

module.exports = class PayInstructionUtils {
    static parse(instruction) {
        let copy = JSON.parse(JSON.stringify(instruction));

        copy.MinStartDate = null;

        return copy;
    }
}