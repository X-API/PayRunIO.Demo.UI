const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const PayRunsQuery = require("../queries/payruns-query");
const moment = require("moment");

let apiWrapper = new ApiWrapper();

module.exports = class RtiController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let rtiTransactionId = ctx.params.rtiTransactionId;

        let apiRoute = `/Employer/${employerId}/RtiTransaction/${rtiTransactionId}`;
        let response = await apiWrapper.get(apiRoute);

        ctx.type = "text/plain; charset=utf-8";
        ctx.body = JSON.stringify(response.RtiFpsTransaction, null, 4);
    }

    async getNewRtiInstruction(ctx) {
        let employerId = ctx.params.employerId;

        let queryStr = JSON.stringify(PayRunsQuery).replace("$$EmployerKey$$", employerId);

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

    async post(ctx) {
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
            PaymentDate: payRun.PayRun.PaymentDate,
            Timestamp: moment().format("YYYY-MM-DDTHH:mm:ss"),
            HoldingDate: null,
            LateReason: null
        };

        let response = await apiWrapper.post("/Jobs/rti", { RtiJobInstruction: fpsBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = formValues;

            let queryStr = JSON.stringify(PayRunsQuery)
                .replace("$$EmployerKey$$", employerId);

            let query = JSON.parse(queryStr);
            let paymentDates = await apiWrapper.query(query);

            let body = {
                Status: "",
                EmployerId: employerId,
                PayRuns: paymentDates.PayRunsQuery.PayRuns,
                //layout: "modal"
            };

            await ctx.render("rti-instruction", await this.getExtendedViewModel(ctx, Object.assign(body, { 
                errors: ValidationParser.extractErrors(response)
            })));

            return;
        }

        let jobId = response.Link["@href"].split("/")[3];
        let route = `/employer/${employerId}/job/${jobId}/rti`;

        await ctx.redirect(route);
    }
};