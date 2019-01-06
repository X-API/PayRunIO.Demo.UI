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
    async getPayRunInfo(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        let payRunRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`;

        let queryStr = JSON.stringify(PayRunG2NQuery)
            .replace("$$EmployerKey$$", employerId)
            .replace("$$PayScheduleKey$$", payScheduleId)
            .replace("$$PayRunKey$$", payRunId);

        let query = JSON.parse(queryStr);
        let queryResult = await apiWrapper.query(ctx, query);
        let employees = queryResult.PayrunG2N.PaySchedule.PayRun.Employees;

        let commentaries = await apiWrapper.get(ctx, payRunRoute + "/Commentaries");

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
            title: "Pay Run",
            Employees: mappedEmployees,
            EmployerId: employerId,
            PayScheduleId: payScheduleId,
            PaySchedule: queryResult.PayrunG2N.PaySchedule,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Pay Run" }
            ]            
        });

        await ctx.render("pay-run", await this.getExtendedViewModel(ctx, body));
    }
    
    async requestNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.query.paySchedule;
        let paySchedules = await employerService.getPaySchedules(ctx, employerId);

        let nextPaymentDate;
        let nextPeriodStart;
        let nextPeriodEnd;

        // query next PayRun dates
        if (payScheduleId) {
            let queryStr = JSON.stringify(NextPayRunDatesQuery)
                .replace("$$EmployerKey$$", employerId)
                .replace("$$PayScheduleKey$$", payScheduleId);

            let query = JSON.parse(queryStr);
            let queryResult = await apiWrapper.query(ctx, query);

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
        let isSupplementary;

        // query next rerun dates
        if (payRunId) {
            let result = await apiWrapper.get(ctx, `Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`);

            nextPaymentDate = result.PayRun.PaymentDate;
            nextPeriodStart = result.PayRun.PeriodStart;
            nextPeriodEnd = result.PayRun.PeriodEnd;
            isSupplementary = result.PayRun.IsSupplementary;
        }

        let body = await this.getExtendedViewModel(ctx, {
            Status: "Re-running will delete the previous run.",
            EmployerId: employerId,
            PayScheduleId: payScheduleId,
            PaymentDate: nextPaymentDate,
            StartDate: nextPeriodStart,
            EndDate: nextPeriodEnd,
            IsSupplementary: isSupplementary
        });

        let model = Object.assign(body, { layout: "modal" });
        await ctx.render("pay-run-creation", model);
    }

    async startNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let cleanBody = PayRunUtils.parse(body, employerId);

        let response = await apiWrapper.post(ctx, "jobs/payruns", { PayRunJobInstruction: cleanBody });

        if (ValidationParser.containsErrors(response)) {
            let paySchedules = await employerService.getPaySchedules(ctx, employerId);

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

    async deletePayRun(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`;     
        
        await apiWrapper.delete(ctx, apiRoute);

        // todo: handle error from API

        let route = `/employer/${employerId}#runs`;
        await ctx.redirect(route);
    }
};