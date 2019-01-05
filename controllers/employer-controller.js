const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployerUtils = require("../services/employer-utils");
const StatusUtils = require("../services/status-utils");
const AppState = require("../app-state");
const EmployerQuery = require("../queries/employer-query");
const EmployerRevisionsQuery = require("../queries/employer-revisions-query");
const EmployeesQuery = require("../queries/employees-query");


let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class EmployerController extends BaseController {
    async getEmployers(ctx) {
        let employers = await apiWrapper.query(ctx, EmployerQuery);

        await ctx.render("employers", await this.getExtendedViewModel(ctx, {
            title: "Employers",
            employers: employers
        }));
    }

    async requestNewEmployer(ctx) {
        await ctx.render("employer", await this.getExtendedViewModel(ctx, {
            title: "Add a new Employer",
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Add a new Employer" }
            ]
        }));
    }

    async addNewEmployer(ctx) {
        let body = EmployerUtils.parse(ctx.request.body);
        let response = await apiWrapper.post(ctx, "Employers", { Employer: body });

        if (ValidationParser.containsErrors(response)) {
            await ctx.render("employer", await this.getExtendedViewModel(ctx, Object.assign(body, {
                title: "Add a new Employer",
                errors: ValidationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Add a new Employer" }
                ]
            })));
            return;
        }

        await ctx.redirect(response.Link["@href"] + "?status=Employer details saved&statusType=success");
    }

    async getEmployerDetails(ctx) {
        let id = ctx.params.id;
        let response = await apiWrapper.get(ctx, `Employer/${id}`);
        let employer = response.Employer;      

		let eeQueryStr = JSON.stringify(EmployeesQuery).replace("$$EmployerKey$$", id);
        let eeQuery = JSON.parse(eeQueryStr);   
        let employees = await apiWrapper.query(ctx, eeQuery)        
        
        let pensions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${id}/Pensions`);
        let extendedPensions = pensions.map(pension => {
            if (employer.AutoEnrolment && employer.AutoEnrolment.Pension) {
                pension.UseForAutoEnrolment = employer.AutoEnrolment.Pension["@href"].endsWith(pension.Id);
            }
            else {
                pension.UseForAutoEnrolment = false;
            }

            return pension;
        });

        let holidaySchemes = await apiWrapper.getAndExtractLinks(ctx, `Employer/${id}/HolidaySchemes`);
        let paySchedules = await employerService.getPaySchedules(ctx, id);
        let rtiTransactions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${id}/RtiTransactions`);

        let queryStr = JSON.stringify(EmployerRevisionsQuery).replace("$$EmployerKey$$", id);
        let query = JSON.parse(queryStr);
        let revisions = await apiWrapper.query(ctx, query);

        let payRunCount = 0;

        if (paySchedules.PaySchedulesTable.PaySchedule) {
            paySchedules.PaySchedulesTable.PaySchedule.forEach(ps => {
                if (ps.PayRuns) {
                    payRunCount = payRunCount + ps.PayRuns.length;
                }
            });
        }

        let body = Object.assign(employer, {
            Id: id,
            ShowTabs: true,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: employer.Name }
            ],
            Employees: employees.EmployeesTable.Employees,
            Pensions: extendedPensions,
            HolidaySchemes: holidaySchemes,
            PaySchedules: paySchedules,
            PayRuns: payRunCount > 0,
            RTITransactions: rtiTransactions,
            Revisions: revisions,
            title: employer.Name,
            Status: StatusUtils.extract(ctx)
        });

        // todo: refactor this into session.
        AppState.currentEmployer = employer;

        await ctx.render("employer", await this.getExtendedViewModel(ctx, body));
    }

    async saveEmployerDetails(ctx) {
        let id = ctx.params.id;
        let body = EmployerUtils.parse(ctx.request.body);
        let response = await apiWrapper.put(ctx, `Employer/${id}`, { Employer: body });

        if (ValidationParser.containsErrors(response)) {
            await ctx.render("employer", await this.getExtendedViewModel(ctx, Object.assign(body, {
                Id: id,
                errors: ValidationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: body.Name }
                ]
            })));
            return;
        }

        await ctx.redirect(`/employer/${id}?status=Employer details saved&statusType=success`);
    }
};