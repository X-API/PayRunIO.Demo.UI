const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const moment = require("moment");

let apiWrapper = new ApiWrapper();

module.exports = class RtiController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let rtiTransactionId = ctx.params.rtiTransactionId;

        let apiRoute = `/Employer/${employerId}/RtiTransaction/${rtiTransactionId}`;
        let response = await apiWrapper.get(ctx, apiRoute);

        ctx.type = "text/plain; charset=utf-8";
        ctx.body = JSON.stringify(response.RtiFpsTransaction, null, 4);
    }

    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let apiRoute = `/Employer/${employerId}/PaySchedule/${body.PayScheduleId}/PayRun/${body.PayRunId}`;
        let payRun = await apiWrapper.get(ctx, apiRoute);

        let fpsBody = {
            RtiType: "FPS",
            Generate: body.Generate,
            Transmit: body.Transmit,
            Employer: {
                "@href": `/Employer/${employerId}`
            },
            PaySchedule: payRun.PayRun.PaySchedule,
            TaxYear: payRun.PayRun.TaxYear,
            TaxMonth: payRun.PayRun.TaxPeriod,
            PaymentDate: payRun.PayRun.PaymentDate,
            Timestamp: moment().format("YYYY-MM-DDTHH:mm:ss"),
            HoldingDate: body.HoldingDate,
            LateReason: body.LateReason
        };

        let response = await apiWrapper.post(ctx, "/Jobs/rti", { RtiJobInstruction: fpsBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            let jobId = response.Link["@href"].split("/")[3];

            ctx.body = {
                status: {
                    message: "RTI submission job created",
                    type: "success",
                    job: {
                        id: jobId,
                        type: "rti"
                    }
                }
            };
        }
    }
};