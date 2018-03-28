module.exports = class EmployerUtils {
    static parse(employer) {
        employer.ClaimEmploymentAllowance = (employer.ClaimEmploymentAllowance.toLowerCase() === "on");
        employer.ClaimSmallEmployerRelief = (employer.ClaimSmallEmployerRelief.toLowerCase() === "on");

        //if (employer.RuleExclusions) {
        //    employer.RuleExclusions = employer.RuleExclusions.join("|");
        //}
        //else {
        employer.RuleExclusions = "None";
        //}

        return employer;
    }
};