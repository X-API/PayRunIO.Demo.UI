const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const EmployerService = require("../services/employer-service");
const RtiUtils = require("../services/rti-utils");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class RtiController extends BaseController {

    async getNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let paySchedules = await employerService.getPaySchedules(employerId);

        let body = {
            title: "Create a RTI FPS submission",
            EmployerId: employerId,
            PaySchedules: paySchedules,
            layout: "modal"
        };

        let extendedBody = await this.getExtendedViewModel(ctx, body);        

        return ctx.render("rti-instruction", extendedBody);
    }

    async postNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let cleanBody = RtiUtils.parse(body, employerId);

        cleanBody.RtiType = "FPS";

        let response = await apiWrapper.post("/Jobs/rti", { RtiJobInstruction: cleanBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);

            await ctx.redirect(`/employer/${employerId}/rtiTransaction`);
            return;
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