const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const AppState = require("../app-state");
const EmployerService = require("../services/employer-service");
const PayRunUtils = require("../services/pay-run-utils");
const PayRunG2NQuery = require("../queries/payrun-g2n-query");

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
        let queryResult = await apiWrapper.query(query);
        let employees = queryResult.PayrunG2N.PaySchedule.PayRun.Employees;

        let commentaries = await apiWrapper.get(payRunRoute + "/Commentaries");

        let mappedEmployees = employees.map(employee => {

            if (commentaries && commentaries.LinkCollection.Links) {
                let commentaryLink = commentaries.LinkCollection.Links.Link.find(commentary => {
                    return commentary["@href"].split("/")[4] === employee.Key;
                });

                employee.Commentary = commentaryLink;
            }

            return employee;
        });

        let body = Object.assign(queryResult.PayrunG2N.PaySchedule.PayRun, {
            title: "Pay Run",
            Employees: mappedEmployees,
            EmployerId: employerId,
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
        let paySchedules = await employerService.getPaySchedules(employerId);
        let body = await this.getExtendedViewModel(ctx, {
            title: "Start a pay run",
            EmployerId: employerId,
            PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Start a pay run" }
            ]
        });

        await ctx.render("pay-run-creation", body);
    }

    async startNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let cleanBody = PayRunUtils.parse(body, employerId);

        let response = await apiWrapper.post("jobs/payruns", { PayRunJobInstruction: cleanBody });
        let employerRoute = `/employer/${employerId}`;

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
        let route = `/employer/${employerId}/job/${jobId}/payRun`;

        await ctx.redirect(route);
    }

    async deletePayRun(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`;     
        let response = await apiWrapper.delete(apiRoute);

        // todo: handle error from API

        let route = `/employer/${employerId}#runs`;
        await ctx.redirect(route);
    }

    async rerunPayRun(ctx) {
        let employerId = ctx.params.employerId;
        let scheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        // todo: enqueue re-run job

        return true;
    }
};