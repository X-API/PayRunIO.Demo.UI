const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const AppState = require("../app-state");
const EmployerService = require("../services/employer-service");
const PayRunUtils = require("../services/pay-run-utils");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class PayRunController extends BaseController {
    async getPayRunInfo(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let payRunId = ctx.params.payRunId;

        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}/PayRun/${payRunId}`;
        let response = await apiWrapper.get(apiRoute);
        let commentaries = await apiWrapper.get(apiRoute + "/Commentaries");
        let employees = await apiWrapper.getAndExtractLinks(apiRoute + "/Employees", href => {
            return href.split("/")[4];
        });
        let mappedEmployees = employees.map(employee => {
            if (commentaries && commentaries.LinkCollection.Links) {
                let commentaryLink = commentaries.LinkCollection.Links.Link.find(commentary => {
                    return commentary["@href"].split("/")[4] === employee.Id;
                });

                employee.Commentary = commentaryLink;
            }

            return employee;
        });

        let body = Object.assign(response.PayRun, {
            title: "Pay Run",
            Employees: mappedEmployees,
            EmployerId: employerId,
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
            PaySchedules: paySchedules,
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
                PaySchedules: paySchedules,
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
};