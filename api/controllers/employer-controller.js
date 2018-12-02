const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployerUtils = require("../services/employer-utils");
const EmployerRevisionsQuery = require("../queries/employer-revisions-query");
const EmployeesQuery = require("../queries/employees-query");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class EmployerController extends BaseController {
    async get(ctx) {
        let id = ctx.params.id;
        let response = await apiWrapper.get(ctx, `Employer/${id}`);
        let employer = response.Employer;
        let paySchedules = await employerService.getPaySchedules(ctx, id);
        let rtiTransactions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${id}/RtiTransactions`);
        let revisions = await this.getRevisions(ctx, id);
        let pensions = await this.getPensions(ctx, employer, id);
        let payCodes = await this.getPayCodes(ctx, id);
        let norminalCodes = await this.getNorminalCodes(ctx, id);
        let payRunCount = await this.getPayRunCount(paySchedules);
        let eeQueryStr = JSON.stringify(EmployeesQuery).replace("$$EmployerKey$$", id);
        let eeQuery = JSON.parse(eeQueryStr);   
        let employees = await apiWrapper.query(ctx, eeQuery);

        console.log(norminalCodes);

        if (employer.RuleExclusions) {
            employer.RuleExclusions = employer.RuleExclusions.split(" ");
        }

        ctx.body = Object.assign(employer, {
            Id: id,
            Employees: employees.EmployeesTable.Employees,
            Pensions: pensions,
            PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
            PayRuns: payRunCount > 0,
            RTITransactions: rtiTransactions,
            Revisions: revisions,
            PayCodes: payCodes,
            NominalCodes: norminalCodes
        });
    }

    async paySchedules(ctx) {
        let id = ctx.params.id;

        let paySchedules = await employerService.getPaySchedules(ctx, id);

        ctx.body = paySchedules.PaySchedulesTable.PaySchedule;
    }

    async rtiSubmissions(ctx) {
        let id = ctx.params.id;

        let rtiTransactions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${id}/RtiTransactions`);

        ctx.body = rtiTransactions;
    }

    async post(ctx) {
        let body = ctx.request.body;

        let parsedBody = EmployerUtils.parse(body);
        let employerId = body.Id;
        let response = null;

        if (employerId) {
            response = await apiWrapper.put(ctx, `Employer/${employerId}`, { Employer: parsedBody });
        }
        else {
            response = await apiWrapper.post(ctx, "Employers", { Employer: parsedBody });
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            if (!employerId) {
                employerId = response.Link["@href"].split("/").slice(-1)[0];
            }

            ctx.body = {
                employerId: employerId,
                status: {
                    message: "Employer details saved",
                    type: "success"
                }
            };
        }
    }

    async delete(ctx) {
        let id = ctx.params.id;
        let apiRoute = `/Employer/${id}`;
        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Employer deleted",
                    type: "success"
                }
            };
        }
    }

    async deleteRevision(ctx) {
        let id = ctx.params.id;
        let effectiveDate = ctx.params.effectiveDate;
        let apiRoute = `/Employer/${id}/${effectiveDate}`;
        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Revision deleted",
                    type: "success"
                }
            };
        }
    }

    async getPensions(ctx, employer, employerId) {
        let pensions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${employerId}/Pensions`);

        let extendedPensions = pensions.map(pension => {
            if (employer.AutoEnrolment && employer.AutoEnrolment.Pension) {
                pension.UseForAutoEnrolment = employer.AutoEnrolment.Pension["@href"].endsWith(pension.Id);
            }
            else {
                pension.UseForAutoEnrolment = false;
            }

            return pension;
        });

        return extendedPensions;
    }

    async getPayRunCount(schedules) {
        let payRunCount = 0;

        if (schedules.PaySchedulesTable.PaySchedule) {
            schedules.PaySchedulesTable.PaySchedule.forEach(ps => {
                if (ps.PayRuns) {
                    payRunCount = payRunCount + ps.PayRuns.length;
                }
            });
        }

        return payRunCount;
    }

    async getRevisions(ctx, employerId) {
        let queryStr = JSON.stringify(EmployerRevisionsQuery).replace("$$EmployerKey$$", employerId);

        let query = JSON.parse(queryStr);
        
        let revisions = await apiWrapper.query(ctx, query);
        
        return Array.from(revisions.EmployerRevisions.Revisions.Revision);
    }

    async getPayCodes(ctx, employerId) {
        let payCodes = await apiWrapper.getAndExtractLinks(ctx, `Employer/${employerId}/PayCodes`);
        
        return payCodes;
    }

    async getNorminalCodes(ctx, employerId) {
        let norminalCodes = await apiWrapper.getAndExtractLinks(ctx, `Employer/${employerId}/NominalCodes`);
        
        return norminalCodes;
    }
};