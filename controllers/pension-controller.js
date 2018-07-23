const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const PensionUtils = require("../services/pension-utils");

let apiWrapper = new ApiWrapper();

module.exports = class PensionController extends BaseController {
    async getNewPension(ctx) {
        let employerId = ctx.params.employerId;

        await ctx.render("pension", await this.getExtendedViewModel(ctx, {
            title: "Add a new Pension",
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Add a new Pension" }
            ]
        }));
    }
    
    async postNewPension(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let parsedBody = PensionUtils.parse(body);
        let response = await apiWrapper.post(`Employer/${employerId}/Pensions`, { Pension: parsedBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(`/employer/${employerId}/pension`);
            return;
        }

        await ctx.redirect(`/employer/${employerId}?status=Pension added&statusType=success#pensions`);
    }

    async getExistingPension(ctx) {
        let employerId = ctx.params.employerId;
        let pensionId = ctx.params.id;
        let apiRoute = `/Employer/${employerId}/Pension/${pensionId}`;
        let response = await apiWrapper.get(apiRoute);
        let pension = response.Pension;

        let body = Object.assign(pension, {
            Id: pensionId,
            title: pensionId,
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: pensionId }
            ]
        });

        await ctx.render("pension", await this.getExtendedViewModel(ctx, body));        
    }

    async postExistingPension(ctx) {
        let id = ctx.params.id;
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let parsedBody = PensionUtils.parse(body);
        let response = await apiWrapper.put(`Employer/${employerId}/Pension/${id}`, { Pension: parsedBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(`/employer/${employerId}/pension/${id}`);
            return;
        }

        await ctx.redirect(`/employer/${employerId}?status=Pension updated&statusType=success#pensions`);
    }

    //async postDeletePension(ctx) {
    //}

    async postAEDefault(ctx) {
        let id = ctx.params.id;
        let employerId = ctx.params.employerId;

        await apiWrapper.patch(`/Employer/${employerId}`, {
            Employer: {
                AutoEnrolment: {
                    Pension: {
                        "@href": `/Employer/${employerId}/Pension/${id}`
                    }
                }
            }
        });

        return true;
    }
};