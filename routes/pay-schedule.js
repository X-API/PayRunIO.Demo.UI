const router = require("koa-router")();
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const AppState = require("../app-state");

const apiWrapper = new ApiWrapper();
const validationParser = new ValidationParser();

router
    .get("/:employerId/paySchedule/new", async ctx => {
        let employerId = ctx.params.employerId;

        await ctx.render("pay-schedule", {
            title: "Add a new Pay Schedule",
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: AppState.currentEmployer.Name, Url: `/employer/${employerId}` },
                { Name: "Add a new Pay Schedule" }
            ]
        });        
    })

    .post("/:employerId/paySchedule", async ctx => {
        let body = ctx.request.body;
        let apiRoute = `Employer/${ctx.params.employerId}/paySchedules`;
        let response = await apiWrapper.post(apiRoute, { PaySchedule: body });

        let employerRoute = `/employer/${ctx.params.employerId}`;

        if (validationParser.containsErrors(response)) {
            await ctx.render("pay-schedule", Object.assign(body, { 
                title: "Add a new Pay Schedule",
                EmployerId: employerId,
                errors: validationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: AppState.currentEmployer.Name, Url: employerRoute },
                    { Name: "Add a new Pay Schedule" }
                ]
            }));
            return;
        }

        await ctx.redirect(employerRoute + "?status=Pay schedule saved&statusType=success#schedules");
    })

    .get("/:employerId/paySchedule/:payScheduleId", async ctx => {
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

        await ctx.render("pay-schedule", body);
    })
    
    .post("/:employerId/paySchedule/:payScheduleId", async ctx => {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        let body = ctx.request.body;
        let apiRoute = `Employer/${employerId}/paySchedule/${payScheduleId}`;
        let response = await apiWrapper.put(apiRoute, { PaySchedule: body });

        let employerRoute = `/employer/${employerId}`;

        if (validationParser.containsErrors(response)) {
            await ctx.render("pay-schedule", Object.assign(body, { 
                title: body.Name,
                EmployerId: employerId,
                errors: validationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: AppState.currentEmployer.Name, Url: employerRoute },
                    { Name: body.Name }
                ]
            }));
            return;
        }

        await ctx.redirect(employerRoute + "?status=Pay schedule saved&statusType=success#schedules");
    })
    
    .post("/:employerId/paySchedule/:payScheduleId/delete", async ctx => {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        
        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}`;

        let response = await apiWrapper.delete(apiRoute);

        return true;
    });

module.exports = router;