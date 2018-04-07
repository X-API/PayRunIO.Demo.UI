const FormUtils = require("./form-utils");

module.exports = class EmployeeUtils {
    static parse(employee, employerId) {
        let copy = JSON.parse(JSON.stringify(employee));

        copy.IsAgencyWorker = FormUtils.checkboxToBool(copy.IsAgencyWorker);
        copy.EEACitizen = FormUtils.checkboxToBool(copy.EEACitizen);
        copy.EPM6 = FormUtils.checkboxToBool(copy.EPM6);
        copy.PaymentToANonIndividual = FormUtils.checkboxToBool(copy.PaymentToANonIndividual);
        copy.IrregularEmployment = FormUtils.checkboxToBool(copy.IrregularEmployment);
        copy.OnStrike = FormUtils.checkboxToBool(copy.OnStrike);
        copy.Deactivated = FormUtils.checkboxToBool(copy.Deactivated);

        if (copy.PaySchedule) {
            copy.PaySchedule = {
                "@href": `/Employer/${employerId}/PaySchedule/${copy.PaySchedule}`
            };
        }

        if (copy.WorkingWeek) {
            if (Array.isArray(copy.WorkingWeek)) {
                copy.WorkingWeek = copy.WorkingWeek.join(" ");
            }
        }
        else {
            copy.WorkingWeek = "AllWeekDays";
        }

        if (copy.NicLiability) {
            if (Array.isArray(copy.NicLiability)) {
                copy.NicLiability = copy.NicLiability.join(" ");
            }
        } 
        else {
            copy.NicLiability = "IsFullyLiable"
        }

        if (copy.RuleExclusions) {
            if (Array.isArray(copy.RuleExclusions)) {
                copy.RuleExclusions = copy.RuleExclusions.join(" ");
            }
        }
        else {
            copy.RuleExclusions = "None";
        }

        let hasPartnerValueSet = false;

        for (let prop in copy.copyPartner) {
            if (copy.copyPartner[prop] && copy.copyPartner.hasOwnProperty(prop)) {
                hasPartnerValueSet = true;
            }
        }

        if (!hasPartnerValueSet) {
            copy.copyPartner = null;
        }

        return copy;
    }

    static parseFromApi(employee) {
        let copy = JSON.parse(JSON.stringify(employee));

        if (copy.PaySchedule) {
            let href = copy.PaySchedule["@href"];
            let hrefParts = href.split("/");
            let id = hrefParts[hrefParts.length - 1];

            copy.PaySchedule = id;
        }

        return copy;
    }
};