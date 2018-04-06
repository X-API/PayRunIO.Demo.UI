const FormUtils = require("./form-utils");

module.exports = class EmployeeUtils {
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

        if (employee.WorkingWeek) {
            if (Array.isArray(employee.WorkingWeek)) {
                employee.WorkingWeek = employee.WorkingWeek.join(" ");
            }
        }
        else {
            employee.WorkingWeek = "AllWeekDays";
        }

        if (employee.NicLiability) {
            if (Array.isArray(employee.NicLiability)) {
                employee.NicLiability = employee.NicLiability.join(" ");
            }
        } 
        else {
            employee.NicLiability = "IsFullyLiable"
        }

        if (employee.RuleExclusions) {
            if (Array.isArray(employee.RuleExclusions)) {
                employee.RuleExclusions = employee.RuleExclusions.join(" ");
            }
        }
        else {
            employee.RuleExclusions = "None";
        }

        let hasPartnerValueSet = false;

        for (let prop in employee.EmployeePartner) {
            if (employee.EmployeePartner[prop] && employee.EmployeePartner.hasOwnProperty(prop)) {
                hasPartnerValueSet = true;
            }
        }

        if (!hasPartnerValueSet) {
            employee.EmployeePartner = null;
        }

        return employee;
    }
};