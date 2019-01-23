module.exports = class PayRunUtils {
    static parse(run, employerId) {
        let employees = run.Employees;
        let copy = JSON.parse(JSON.stringify(run));

        copy.IsSupplementary = (copy.IsSupplementary !== undefined && copy.IsSupplementary.toLowerCase() === "on");
        copy.SelectEmployees = (copy.SelectEmployees !== undefined && copy.SelectEmployees.toLowerCase() === "on");

        copy.PaySchedule = {
            "@href": `/Employer/${employerId}/PaySchedule/${copy.PaySchedule}`
        };

        if (copy.Employees && copy.SelectEmployees && employees.indexOf("AllEmployees") === -1) { 
            copy.Employees = { "Employee": [] };
            if (Array.isArray(employees)) {
                for (var i = 0; i < employees.length; i++) {
                    copy.Employees["Employee"].push({ "@href": employees[i] });
                }
            } else {
                copy.Employees["Employee"].push({ "@href": employees });
            }
        }
        else {
            copy.Employees = null;
        }

        delete copy.SelectEmployees;

        return copy;
    }
};