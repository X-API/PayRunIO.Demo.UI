const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const AppState = require("../app-state");
const EmployerService = require("../services/employer-service");
const PayRunUtils = require("../services/pay-run-utils");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class PayRunController extends BaseController {
    async requestNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let paySchedules = await employerService.getPaySchedules(employerId);
        let body = await this.getExtendedViewModel({
            title: "Start a pay run",
            EmployerId: employerId,
            PaySchedules: paySchedules,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Start a pay run" }
            ]
        });

        await ctx.render("pay-run", body);
    }

    async startNewRun(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let cleanBody = PayRunUtils.parse(body, employerId);

        let response = await apiWrapper.post("jobs/payruns", { PayRunJobInstruction: cleanBody });
        let employerRoute = `/employer/${employerId}`;

        if (ValidationParser.containsErrors(response)) {
            let paySchedules = await employerService.getPaySchedules(employerId);

            let extendedBody = await this.getExtendedViewModel(Object.assign(body, {
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
    
            await ctx.render("pay-run", extendedBody);
            return;
        }

        let jobId = response.Link["@href"].split("/")[3];
        let route = `/employer/${employerId}/payRun/job/${jobId}`;

        await ctx.redirect(route);
    }

    async getJobDetails(ctx) {
        let employerId = ctx.params.employerId;
        let jobId = ctx.params.jobId;
        let response = await apiWrapper.get(`/Jobs/PayRuns/${jobId}/Info`);

        let body = response.JobInfo;

        body.title = "Pay Run Info";
        body.Breadcrumbs = [
            { Name: "Employers", Url: "/employer" },
            { Name: "Employer", Url: `/employer/${employerId}` },
            { Name: "Pay run" }
        ];

        await ctx.render("pay-run-job", body);
    }
};