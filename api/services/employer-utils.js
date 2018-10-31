module.exports = class EmployerUtils {
    static parse(employer) {
        let copy = JSON.parse(JSON.stringify(employer));

        copy.Id = null;
        copy.Employees = null;
        copy.Pensions = null;
        copy.PaySchedules = null;
        copy.PayRuns = null;
        copy.RTITransactions = null;
        copy.Revisions = null;
        copy.PayCodes = null;

        if (copy.RuleExclusions) {
            copy.RuleExclusions = employer.RuleExclusions.join(" ");
        }
        else {
            copy.RuleExclusions = "None";
        }

        return copy;
    }
};