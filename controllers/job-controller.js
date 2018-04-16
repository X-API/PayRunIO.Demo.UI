const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class JobController extends BaseController {
    async getJobDetails(ctx) {
        let employerId = ctx.params.employerId;
        let jobId = ctx.params.jobId;
        let type = ctx.params.type.trim().toLowerCase();
        
        let apiRoute = type === "payrun" ? `/Jobs/PayRuns/${jobId}/Info` : `/Jobs/RTI/${jobId}/Info`;
        
        let response = await apiWrapper.get(apiRoute);
        
        if (response.JobInfo) {
            let body = response.JobInfo;

            body.title = type === "payrun" ? "Pay Run Info" : "RTI Full Payment Submission";
            body.Breadcrumbs = [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: body.title }
            ];

            await ctx.render("job-details", await this.getExtendedViewModel(ctx, body));
        }
        else {
            await ctx.render("job-details", await this.getExtendedViewModel(ctx, {}));
        }
    }
};