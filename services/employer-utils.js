module.exports = class EmployerUtils {
    static parse(employer) {
        let copy = JSON.parse(JSON.stringify(employer));

        copy.ClaimEmploymentAllowance = (employer.ClaimEmploymentAllowance && employer.ClaimEmploymentAllowance.toLowerCase() === "on");
        copy.ClaimSmallEmployerRelief = (employer.ClaimSmallEmployerRelief && employer.ClaimSmallEmployerRelief.toLowerCase() === "on");

        if (copy.RuleExclusions) {
            copy.RuleExclusions = employer.RuleExclusions.join(" ");
        }
        else {
            copy.RuleExclusions = "None";
        }

        return copy;
    }
};