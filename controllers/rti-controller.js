const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const EmployerService = require("../services/employer-service");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class RtiController extends BaseController {
    async getNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let payRunId = ctx.query.payRunId;
        let paySchedules = await employerService.getPaySchedules(employerId);
        let payRuns = await employerService.getPayRuns(employerId, paySchedules);

        let body = {
            title: "Create a RTI FPS submission",
            EmployerId: employerId,
            PayRunId: payRunId || "",
            PaySchedules: paySchedules,
            PayRuns: payRuns,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "RTI FPS submission" }
            ]            
        };
        let extendedBody = await this.getExtendedViewModel(body);        

        return ctx.render("rti-instruction", extendedBody);
    }

    async postNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let payRunId = ctx.query.payRunId;
        let body = ctx.request.body;

        body.RtiType = "FPS";

        let response = apiWrapper.post("/Jobs/rti", { RtiJobInstruction: body });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);

            await ctx.redirect(`/employer/${employerId}/rtiTransaction?payRunId=${payRunId}`);
        }

        let jobId = response.Link["@href"].split("/")[3];
        let route = `/employer/${employerId}/job/${jobId}/rti`;

        await ctx.redirect(route);
    }
    
    async getTransactionResults(ctx) {
        let employerId = ctx.params.employerId;
        let rtiTransactionId = ctx.params.rtiTransactionId;

        let apiRoute = `/Employer/${employerId}/RtiTransaction/${rtiTransactionId}`;
        let response = await apiWrapper.get(apiRoute);

        ctx.type = "text/plain; charset=utf-8";
        ctx.body = JSON.stringify(response.RtiFpsTransaction, null, 4);
    }
};