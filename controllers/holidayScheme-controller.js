const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const HolidaySchemeUtils = require("../services/holidayScheme-utils");

let apiWrapper = new ApiWrapper();

module.exports = class HolidaySchemeController extends BaseController {
    async getNewHolidayScheme(ctx) {
        let employerId = ctx.params.employerId;

        await ctx.render("holiday-scheme", await this.getExtendedViewModel(ctx, {
            title: "Add a new Holiday Scheme",
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Add a new Holiday Scheme" }
            ]
        }));
    }
    
    async postNewHolidayScheme(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let parsedBody = HolidaySchemeUtils.parse(body);
        let response = await apiWrapper.post(ctx, `Employer/${employerId}/HolidaySchemes`, { HolidayScheme: parsedBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(`/employer/${employerId}/holidayScheme`);
            return;
        }

        await ctx.redirect(`/employer/${employerId}?status=Holiday Scheme added&statusType=success#holidays`);
    }

    async getExistingHolidayScheme(ctx) {
        let employerId = ctx.params.employerId;
        let holidaySchemeId = ctx.params.id;
        let apiRoute = `/Employer/${employerId}/HolidayScheme/${holidaySchemeId}`;
        let response = await apiWrapper.get(ctx, apiRoute);
        let holidayScheme = response.HolidayScheme;

        let body = Object.assign(holidayScheme, {
            Id: holidaySchemeId,
            title: holidaySchemeId,
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: holidaySchemeId }
            ]
        });

        await ctx.render("holiday-scheme", await this.getExtendedViewModel(ctx, body));        
    }

    async postExistingHolidayScheme(ctx) {
        let id = ctx.params.id;
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let parsedBody = HolidaySchemeUtils.parse(body);
        let response = await apiWrapper.put(ctx, `Employer/${employerId}/HolidayScheme/${id}`, { HolidayScheme: parsedBody });

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(`/employer/${employerId}/HolidayScheme/${id}`);
            return;
        }

        await ctx.redirect(`/employer/${employerId}?status=Holiday Scheme updated&statusType=success#holidays`);
    }

    async postDeletePension(ctx) {
        let employerId = ctx.params.employerId;
        let id = ctx.params.id;
        
        let apiRoute = `/Employer/${employerId}/HolidayScheme/${id}`;

        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {};
        }        
    }
};