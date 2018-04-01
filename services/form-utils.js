module.exports = class FormUtils {
    static checkboxToBool(field) {
        return field && field.toLowerCase() === "on";
    }
};