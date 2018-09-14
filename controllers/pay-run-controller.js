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

        let message = "";

        let body = await this.getExtendedViewModel(ctx, {
            Status: message,
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

    async requestReRun(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.query.paySchedule;
        let payRunId = ctx.query.payRunId;

        let nextPaymentDate;
        let nextPeriodStart;
        let nextPeriodEnd;

        // query next rerun dates
        if (payRunId) {
            let result = await apiWrapper.get(`Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`);

            nextPaymentDate = result.PayRun.PaymentDate;
            nextPeriodStart = result.PayRun.PeriodStart;
            nextPeriodEnd = result.PayRun.PeriodEnd;
        }

        let body = await this.getExtendedViewModel(ctx, {
            Status: "Re-running will delete the previous run.",
            EmployerId: employerId,
            PayScheduleId: payScheduleId,
            PaymentDate: nextPaymentDate,
            StartDate: nextPeriodStart,
            EndDate: nextPeriodEnd
        });

        let model = Object.assign(body, { layout: "modal" });
        await ctx.render("pay-run-creation", model);
    }

    async startNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let cleanBody = PayRunUtils.parse(body, employerId);

        let response = await apiWrapper.post("jobs/payruns", { PayRunJobInstruction: cleanBody });

        if (ValidationParser.containsErrors(response)) {
            let paySchedules = await employerService.getPaySchedules(employerId);

            let extendedBody = await this.getExtendedViewModel(ctx, Object.assign(body, {
                title: "Start a pay run",
                EmployerId: employerId,
                PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
                errors: ValidationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Employer", Url: `/employer/${employerId}` },
                    { Name: "Start a pay run" }
                ]
            }));
    
            await ctx.render("pay-run-creation", extendedBody);
            return;
        }

        let jobId = response.Link["@href"].split("/")[3];
        let route = `/employer/${employerId}?jobId=${jobId}#runs`;

        await ctx.redirect(route);
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`;     
        
        let response = await apiWrapper.delete(apiRoute);

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
};