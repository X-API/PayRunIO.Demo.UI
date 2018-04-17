const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const AppState = require("../app-state");

const apiWrapper = new ApiWrapper();

module.exports = class PayScheduleController extends BaseController {
    async requestNewSchedule(ctx) {
        let employerId = ctx.params.employerId;

        let body = await this.getExtendedViewModel(ctx, {
            title: "Add a new Pay Schedule",
            EmployerId: employerId
        });     
        
        let model = Object.assign(body, { layout: "modal" })
        await ctx.render("pay-schedule", model);
    }

    async addNewSchedule(ctx) {
        let body = ctx.request.body;
        let apiRoute = `Employer/${ctx.params.employerId}/paySchedules`;
        let response = await apiWrapper.post(apiRoute, { PaySchedule: body });

        let employerRoute = `/employer/${ctx.params.employerId}`;

        if (ValidationParser.containsErrors(response)) {
            model = await this.getExtendedViewModel(ctx, Object.assign(body, { 
                title: "Add a new Pay Schedule",
                EmployerId: employerId,
                errors: ValidationParser.extractErrors(response)
            }));

            await ctx.render("pay-schedule", model);

            return;
        }

        await ctx.redirect(employerRoute + "?status=Pay schedule saved&statusType=success#schedules");
    }

    async getScheduleDetails(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}`;
        let response = await apiWrapper.get(apiRoute);

        let body = Object.assign(response.PaySchedule, {
            Id: payScheduleId,
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: AppState.currentEmployer.Name, Url: `/employer/${employerId}` },
                { Name: response.PaySchedule.Name }
            ],
            title: response.PaySchedule.Name
        });

        await ctx.render("pay-schedule", await this.getExtendedViewModel(ctx, body));
    }

    async saveScheduleDetails(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let body = ctx.request.body;
        let apiRoute = `Employer/${employerId}/paySchedule/${payScheduleId}`;
        let response = await apiWrapper.put(apiRoute, { PaySchedule: body });

        let employerRoute = `/employer/${employerId}`;

        if (ValidationParser.containsErrors(response)) {
            await ctx.render("pay-schedule", await this.getExtendedViewModel(ctx, Object.assign(body, { 
                title: body.Name,
                EmployerId: employerId,
                errors: ValidationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: AppState.currentEmployer.Name, Url: employerRoute },
                    { Name: body.Name }
                ]
            })));
            return;
        }

        await ctx.redirect(employerRoute + "?status=Pay schedule saved&statusType=success#schedules");        
    }

    async deleteSchedule(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        
        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}`;

        let response = await apiWrapper.delete(apiRoute);

        return true;
    }
};