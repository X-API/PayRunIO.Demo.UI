const FormUtils = require("./form-utils");

module.exports = class EmployerUtils {
    static parse(employee) {
        employee.IsAgencyWorker = FormUtils.checkboxToBool(employee.IsAgencyWorker);
        employee.EEACitizen = FormUtils.checkboxToBool(employee.EEACitizen);
        employee.EPM6 = FormUtils.checkboxToBool(employee.EPM6);
        employee.PaymentToANonIndividual = FormUtils.checkboxToBool(employee.PaymentToANonIndividual);
        employee.IrregularEmployment = FormUtils.checkboxToBool(employee.IrregularEmployment);
        employee.OnStrike = FormUtils.checkboxToBool(employee.OnStrike);
        employee.Deactivated = FormUtils.checkboxToBool(employee.Deactivated);

        if (employee.PaySchedule) {

        }

        if (employee.WorkingWeek && Array.isArray(employee.WorkingWeek)) {
            employee.WorkingWeek = employee.WorkingWeek.join(" ");
        }

        if (employee.NicLiability && Array.isArray(employee.NicLiability)) {
            employee.NicLiability = employee.NicLiability.join(" ");
        }

        if (employee.RuleExclusions) {
            if (Array.isArray(employee.RuleExclusions)) {
                employee.RuleExclusions = employee.RuleExclusions.join(" ");
            }
        }
        else {
            employee.RuleExclusions = "None";
        }

        return employee;
    }
};