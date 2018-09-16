const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const EmployerService = require("../services/employer-service");
const PayRunUtils = require("../services/pay-run-utils");
const PayRunG2NQuery = require("../queries/payrun-g2n-query");
const NextPayRunDatesQuery = require("../queries/next-payrun-dates-query");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class PayRunController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        let payRunRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`;

        let queryStr = JSON.stringify(PayRunG2NQuery)
            .replace("$$EmployerKey$$", employerId)
            .replace("$$PayScheduleKey$$", payScheduleId)
            .replace("$$PayRunKey$$", payRunId);

        let query = JSON.parse(queryStr);
        let queryResult = await apiWrapper.query(query);
        let employees = queryResult.PayrunG2N.PaySchedule.PayRun.Employees;

        let commentaries = await apiWrapper.get(payRunRoute + "/Commentaries");

        let mappedEmployees = [];

        if (employees) {
            mappedEmployees = employees.map(employee => {
                if (commentaries && commentaries.LinkCollection.Links) {
                    let commentaryLink = commentaries.LinkCollection.Links.Link.find(commentary => {
                        return commentary["@href"].split("/")[4] === employee.Key;
                    });
    
                    employee.Commentary = commentaryLink;
                }
    
                return employee;
            });
        }

        let body = Object.assign(queryResult.PayrunG2N.PaySchedule.PayRun, {
            Employees: mappedEmployees,
            PaySchedule: queryResult.PayrunG2N.PaySchedule.Name,
            PayFrequency: queryResult.PayrunG2N.PaySchedule.PayFrequency
        });

        ctx.body = body;
    }
    
    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let cleanBody = PayRunUtils.parse(body, employerId);
        let response = await apiWrapper.post("jobs/payruns", { PayRunJobInstruction: cleanBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            let jobId = response.Link["@href"].split("/")[3];

            ctx.body = {
                status: {
                    message: "Pay Run job created",
                    type: "success",
                    job: {
                        id: jobId,
                        type: "payrun"
                    }
                }                
            };
        }
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;
        let response = await apiWrapper.delete(`/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay Run deleted",
                    type: "success"
                }
            };
        }
    }

    async requestNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.query.paySchedule;
        let paySchedules = await employerService.getPaySchedules(employerId);

        let nextPaymentDate;
        let nextPeriodStart;
        let nextPeriodEnd;

        // query next PayRun dates
        if (payScheduleId) {
            let queryStr = JSON.stringify(NextPayRunDatesQuery)
                .replace("$$EmployerKey$$", employerId)
                .replace("$$PayScheduleKey$$", payScheduleId);

            let query = JSON.parse(queryStr);
            let queryResult = await apiWrapper.query(query);

            nextPaymentDate = queryResult.NextPayRunDates.NextPayDay;
            nextPeriodStart = queryResult.NextPayRunDates.NextPeriodStart;
            nextPeriodEnd = queryResult.NextPayRunDates.NextPeriodEnd;
        }

        let body = await this.getExtendedViewModel(ctx, {
            EmployerId: employerId,
            PayScheduleId: payScheduleId,
            PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
            PaymentDate: nextPaymentDate,
            StartDate: nextPeriodStart,
            EndDate: nextPeriodEnd
        });

        let model = Object.assign(body, { layout: "modal" });
        await ctx.render("pay-run-creation", model);
    }
};