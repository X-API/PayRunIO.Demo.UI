const FormUtils = require("./form-utils");

module.exports = class PayInstructionUtils {
    static parse(instruction) {
        let copy = JSON.parse(JSON.stringify(instruction));

        // clear out utility properties as otherwise the api will return an error as they are unexpected.
        copy.MinStartDate = null;
        copy.InstructionType = null;

        return copy;
    }
}