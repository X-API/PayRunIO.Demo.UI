const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const EmployerService = require("../services/employer-service");
const PayRunsQuery = require("../queries/payruns-query");
const moment = require("moment");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class RtiController extends BaseController {

    async getNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;

        let queryStr = JSON.stringify(PayRunsQuery)
                .replace("$$EmployerKey$$", employerId);

        let query = JSON.parse(queryStr);

        let paymentDates = await apiWrapper.query(query);

        let body = {
            Status: "",
            EmployerId: employerId,
            PayRuns: paymentDates.PayRunsQuery.PayRuns,
            layout: "modal"
        };

        let extendedBody = await this.getExtendedViewModel(ctx, body);        

        return ctx.render("rti-instruction", extendedBody);
    }

    async postNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let formValues = ctx.request.body;

        let apiRoute = `/Employer/${employerId}/${formValues.PayRun}`;
        let payRun = await apiWrapper.get(apiRoute);

        let fpsBody = {
            RtiType: "FPS",
            Generate: true,
            Transmit: true,
            Employer: {
                "@href": `/Employer/${employerId}`
            },
            PaySchedule: payRun.PayRun.PaySchedule,
            TaxYear: payRun.PayRun.TaxYear,
            TaxMonth: payRun.PayRun.TaxPeriod,
            Timestamp: moment().format("YYYY-MM-DDTHH:mm:ss"),
            HoldingDate: null,
            LateReason: null
        }

        let response = await apiWrapper.post("/Jobs/rti", { RtiJobInstruction: fpsBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = formValues;
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