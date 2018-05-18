const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployerUtils = require("../services/employer-utils");
const StatusUtils = require("../services/status-utils");
const AppState = require("../app-state");
const EmployerQuery = require("../queries/employer-query");
const EmployerRevisionsQuery = require("../queries/employer-revisions-query");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class EmployerController extends BaseController {
	async getEmployers(ctx) {
		let employers = await apiWrapper.query(EmployerQuery);

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
		let response = await apiWrapper.post("Employers", { Employer: body });

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
		let response = await apiWrapper.get(`Employer/${id}`);
		let employees = await apiWrapper.getAndExtractLinks(`Employer/${id}/Employees`);
		let paySchedules = await employerService.getPaySchedules(id);
		let rtiTransactions = await apiWrapper.getAndExtractLinks(`Employer/${id}/RtiTransactions`);
		
		let queryStr = JSON.stringify(EmployerRevisionsQuery).replace("$$EmployerKey$$", id);
		let query = JSON.parse(queryStr);
		let revisions = await apiWrapper.query(query);

		let payRunCount = 0;

		if (paySchedules.PaySchedulesTable.PaySchedule) {
			paySchedules.PaySchedulesTable.PaySchedule.forEach(ps => {
				if (ps.PayRuns)
				{
					payRunCount = payRunCount + ps.PayRuns.length;
				}
			});
		}

		let body = Object.assign(response.Employer, {
			Id: id,
			ShowTabs: true,
			Breadcrumbs: [
				{ Name: "Employers", Url: "/employer" },
				{ Name: response.Employer.Name }
			],
			Employees: employees,
			PaySchedules: paySchedules,
			PayRuns: payRunCount > 0,
			RTITransactions: rtiTransactions,
			Revisions: revisions,
			title: response.Employer.Name,
			Status: StatusUtils.extract(ctx)
		});

		// todo: refactor this into session.
		AppState.currentEmployer = response.Employer;

		await ctx.render("employer", await this.getExtendedViewModel(ctx, body));
	}

	async saveEmployerDetails(ctx) {
		let id = ctx.params.id;
		let body = EmployerUtils.parse(ctx.request.body);
		let response = await apiWrapper.put(`Employer/${id}`, { Employer: body });

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