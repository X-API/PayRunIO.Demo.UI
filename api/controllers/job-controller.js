const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class JobController extends BaseController {
    async get(ctx) {
        let jobId = ctx.params.jobId;
        let type = ctx.params.type.trim().toLowerCase();
        let apiRoute = type === "payrun" ? `/Jobs/PayRuns/${jobId}/Info` : `/Jobs/RTI/${jobId}/Info`;
        let response = await apiWrapper.get(apiRoute);
        let body = response.JobInfo;

        body.Title = type === "payrun" ? "Pay Run Info" : "RTI Full Payment Submission";
        body.Progress = parseFloat(body.Progress) * 100;
        body.Errors = body.Errors && body.Errors.Error.length > 0 ? body.Errors.Error : [];

        ctx.body = body;
    }
};