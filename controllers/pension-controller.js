const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

let apiWrapper = new ApiWrapper();

module.exports = class PensionController extends BaseController {
	async getNewPension(ctx) {
        let employerId = ctx.params.employerId;

        await ctx.render("pension", await this.getExtendedViewModel(ctx, {
            title: "Add a new Pension",
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: AppState.currentEmployer.Name, Url: `/employer/${employerId}` },
                { Name: "Add a new Pension" }
            ]
        }));
    }
    
    async postNewPension(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let response = await apiWrapper.post(`Employer/${employerId}/Pensions`, { Pension: body });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(`/employer/${employerId}/pension`);
            return;
        }

        await ctx.redirect("/employer?status=Pension added&statusType=success#pensions");
    }

    async getExistingPension(ctx) {

    }

    async postExistingPension(ctx) {
        let id = ctx.params.id;
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let response = await apiWrapper.put(`Employer/${employerId}/Pension/${id}`, { Pension: body });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(`/employer/${employerId}/pension/${id}`);
            return;
        }

        await ctx.redirect("/employer?status=Pension updated&statusType=success#pensions");
    }

    async postDeletePension(ctx) {

    }
};