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
        let pensions = await apiWrapper.getAndExtractLinks(`Employer/${id}/Pensions`);
        let extendedPensions = pensions.map(pension => {
            if (employer.AutoEnrolment.Pension) {
                pension.UseForAutoEnrolment = employer.AutoEnrolment.Pension["@href"].endsWith(pension.Id);
            }
            else {
                pension.UseForAutoEnrolment = false;
            }

            return pension;
        });
        let paySchedules = await employerService.getPaySchedules(id);
        let rtiTransactions = await apiWrapper.getAndExtractLinks(`Employer/${id}/RtiTransactions`);

        let queryStr = JSON.stringify(EmployerRevisionsQuery).replace("$$EmployerKey$$", id);

        let query = JSON.parse(queryStr);
        
        let revisions = await apiWrapper.query(query);

        let payRunCount = 0;

        if (paySchedules.PaySchedulesTable.PaySchedule) {
            paySchedules.PaySchedulesTable.PaySchedule.forEach(ps => {
                if (ps.PayRuns) {
                    payRunCount = payRunCount + ps.PayRuns.length;
                }
            });
        }

        ctx.body = Object.assign(employer, {
            Id: id,
            Employees: employees,
            Pensions: extendedPensions,
            PaySchedules: paySchedules,
            PayRuns: payRunCount > 0,
            RTITransactions: rtiTransactions,
            Revisions: revisions,
        });
    }

    async post(ctx) {
        let body = ctx.request.body;
        let parsedBody = EmployerUtils.parse(body);
        let response = null;

        if (body.Id) {
            response = await apiWrapper.put(`Employer/${body.Id}`, { Employer: parsedBody });
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
            ctx.body = {
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
};