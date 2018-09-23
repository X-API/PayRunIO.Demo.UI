const FormUtils = require("./form-utils");

module.exports = class EmployeeUtils {
    static parse(employee, employerId) {
        let copy = JSON.parse(JSON.stringify(employee));

        copy.Id = null;
        copy.EmployerId = null;
        copy.PayInstructions = null;
        copy.GroupedPayInstructions = null;
        copy.CanAddANewPayInstruction = null;

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
            copy.NicLiability = "IsFullyLiable";
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

        console.log("parsed employee: ");
        console.log(copy);

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

        if (copy.WorkingWeek) {
            if (!Array.isArray(copy.WorkingWeek)) {
                copy.WorkingWeek = copy.WorkingWeek.split(" ");
            }
        }

        if (copy.NicLiability) {
            if (!Array.isArray(copy.NicLiability)) {
                copy.NicLiability = copy.NicLiability.split(" ");
            }
        }

        if (copy.RuleExclusions) {
            if (!Array.isArray(copy.RuleExclusions)) {
                copy.RuleExclusions = copy.RuleExclusions.split(" ");
            }
        }

        return copy;
    }
};