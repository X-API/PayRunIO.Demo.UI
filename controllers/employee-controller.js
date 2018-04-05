const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployeeUtils = require("../services/employee-utils");
const AppState = require("../app-state");
const fs = require("fs");

const apiWrapper = new ApiWrapper();
const employerService = new EmployerService();
const validationParser = new ValidationParser();

module.exports = class EmployeeController {
    async requestNewEmployee(ctx) {
        let employerId = ctx.params.employerId;
        let paySchedules = await employerService.getPaySchedules(employerId);

        await ctx.render("employee", await BaseController.getExtendedViewModel({
            title: "Add a new Employee",
            EmployerId: employerId,
            PaySchedules: paySchedules,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: AppState.currentEmployer.Name, Url: `/employer/${employerId}` },
                { Name: "Add a new Employee" }
            ]
        }));        
    }
    
    async addNewEmployee(ctx) {
        let body = EmployeeUtils.parse(ctx.request.body);
        let employerId = ctx.params.employerId;
        let response = await apiWrapper.post(`Employer/${employerId}/Employees`, { Employee: body });

        if (validationParser.containsErrors(response)) {
            await ctx.render("employee", await BaseController.getExtendedViewModel(Object.assign(body, { 
                title: "Add a new Employee",
                EmployerId: employerId,
                errors: validationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: AppState.currentEmployer.Name, Url: `/employer/${employerId}` },
                    { Name: "Add a new Employee" }
                ]
            })));
            return;
        }

        await ctx.redirect(response.Link["@href"] + "?status=Employee details saved&statusType=success");        
    }

    async getEmployeeDetails(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}`;
        let response = await apiWrapper.get(apiRoute);

        let body = Object.assign(response.Employee, {
            Id: employeeId,
            title: response.Employee.Code,
            EmployerId: employerId,
            ShowTabs: true,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: response.Employee.Code }
            ]
        });

        await ctx.render("employee", await BaseController.getExtendedViewModel(body));
    }
    
    async request60(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}`;
        let response = await apiWrapper.get(apiRoute);

        let body = {
            title: "Download P60",
            EmployeeId: employeeId,
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: response.Employee.Code, Url: `/employer/${employerId}/employee/${employeeId}` },
                { Name: "Download P60" }
            ]
        };

        await ctx.render("download-p60", await BaseController.getExtendedViewModel(body));
    }
    
    async downloadP60(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let body = ctx.request.body;
        let year = body.Year;
        let apiRoute = `/Report/P60/run?EmployerKey=${employerId}&EmployeeKey=${employeeId}&TaxYear=${year}&TransformDefinitionKey=P60-${year}-Pdf`;

        let response = await apiWrapper.getFile(apiRoute);

        ctx.set("Content-disposition", "attachment; filename=p60.pdf");
        ctx.set("Content-type", "application/pdf");
        ctx.body = response.body;        
    }
};