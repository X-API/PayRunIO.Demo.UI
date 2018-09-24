const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployerUtils = require("../services/employer-utils");
const EmployerRevisionsQuery = require("../queries/employer-revisions-query");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class EmployerController extends BaseController {
    async get(ctx) {
        let id = ctx.params.id;
        let response = await apiWrapper.get(`Employer/${id}`);
        let employer = response.Employer;
        let employees = await apiWrapper.getAndExtractLinks(`Employer/${id}/Employees`);
        let paySchedules = await employerService.getPaySchedules(id);
        let rtiTransactions = await apiWrapper.getAndExtractLinks(`Employer/${id}/RtiTransactions`);
        let revisions = await this.getRevisions(id);
        let pensions = await this.getPensions(employer, id);
        let payRunCount = await this.getPayRunCount(paySchedules);

        if (employer.RuleExclusions) {
            employer.RuleExclusions = employer.RuleExclusions.split(" ");
        }

        ctx.body = Object.assign(employer, {
            Id: id,
            Employees: employees,
            Pensions: pensions,
            PaySchedules: paySchedules,
            PayRuns: payRunCount > 0,
            RTITransactions: rtiTransactions,
            Revisions: revisions
        });
    }

    async post(ctx) {
        let body = ctx.request.body;

        let parsedBody = EmployerUtils.parse(body);
        let employerId = body.Id;
        let response = null;

        if (employerId) {
            response = await apiWrapper.put(`Employer/${employerId}`, { Employer: parsedBody });
        }
        else {
            response = await apiWrapper.post("Employers", { Employer: parsedBody });
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            if (!employerId) {
                employerId = response.Link["@href"].split('/').slice(-1)[0];
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
        let response = await apiWrapper.delete(apiRoute);

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
        let response = await apiWrapper.delete(apiRoute);

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

    async getPensions(employer, employerId) {
        let pensions = await apiWrapper.getAndExtractLinks(`Employer/${employerId}/Pensions`);

        let extendedPensions = pensions.map(pension => {
            if (employer.AutoEnrolment.Pension) {
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

    async getRevisions(employerId) {
        let queryStr = JSON.stringify(EmployerRevisionsQuery).replace("$$EmployerKey$$", employerId);

        let query = JSON.parse(queryStr);
        
        let revisions = await apiWrapper.query(query);
        
        return Array.from(revisions.EmployerRevisions.Revisions.Revision);
    }
};