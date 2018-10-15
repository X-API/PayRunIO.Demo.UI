const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployeeUtils = require("../services/employee-utils");
const StatusUtils = require("../services/status-utils");
const AppState = require("../app-state");
const _ = require("lodash");

let apiWrapper = new ApiWrapper();
let employerService = new EmployerService();

module.exports = class EmployeeController extends BaseController {
    async requestNewEmployee(ctx) {
        let employerId = ctx.params.employerId;
        let paySchedules = await employerService.getPaySchedules(ctx, employerId);

        await ctx.render("employee", await this.getExtendedViewModel(ctx, {
            title: "Add a new Employee",
            EmployerId: employerId,
            PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: AppState.currentEmployer.Name, Url: `/employer/${employerId}` },
                { Name: "Add a new Employee" }
            ]
        }));        
    }
    
    async addNewEmployee(ctx) {
        let employerId = ctx.params.employerId;
        let body = EmployeeUtils.parse(ctx.request.body, employerId);
        let response = await apiWrapper.post(ctx, `Employer/${employerId}/Employees`, { Employee: body });

        if (ValidationParser.containsErrors(response)) {
            let paySchedules = await employerService.getPaySchedules(ctx, employerId);

            await ctx.render("employee", await this.getExtendedViewModel(ctx, Object.assign(body, { 
                title: "Add a new Employee",
                EmployerId: employerId,
                PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
                errors: ValidationParser.extractErrors(response),
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
        let response = await apiWrapper.get(ctx, apiRoute);
        let payInstructions = await apiWrapper.getAndExtractLinks(ctx, `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`);

        let filteredPayInstructions = payInstructions.filter(pi => {
            return pi.ObjectType !== "P45PayInstruction";
        });

        let canAddANewPayInstruction = filteredPayInstructions.filter(pi => pi.EndDate).length === filteredPayInstructions.length;
        let paySchedules = await employerService.getPaySchedules(ctx, employerId);
        let employee = EmployeeUtils.parseFromApi(response.Employee);

        let body = Object.assign(employee, {
            Id: employeeId,
            title: employee.Code,
            EmployerId: employerId,
            PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
            PayInstructions: filteredPayInstructions,
            GroupedPayInstructions: this.getNormalGroupedPayInstructions(filteredPayInstructions),
            GroupedYTDPayInstructions: this.getYTDGroupedPayInstructions(filteredPayInstructions),
            CanAddANewPayInstruction: filteredPayInstructions.length === 0 || canAddANewPayInstruction,
            P45PayInstruction: this.getP45PayInstruction(payInstructions),
            ShowTabs: true,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: employee.Code }
            ],
            Status: StatusUtils.extract(ctx)
        });

        await ctx.render("employee", await this.getExtendedViewModel(ctx, body));
    }

    async saveEmployeeDetails(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let body = ctx.request.body;
        let cleanBody = EmployeeUtils.parse(body, employerId);
        let response = await apiWrapper.put(ctx, `/Employer/${employerId}/Employee/${employeeId}`, { Employee: cleanBody });

        if (ValidationParser.containsErrors(response)) {
            let paySchedules = await employerService.getPaySchedules(ctx, employerId);

            let extendedBody = Object.assign(body, {
                Id: employeeId,
                title: body.Code,
                EmployerId: employerId,
                PaySchedules: paySchedules.PaySchedulesTable.PaySchedule,
                errors: ValidationParser.extractErrors(response),
                ShowTabs: true,
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Employer", Url: `/employer/${employerId}` },
                    { Name: body.Code }
                ]
            });

            await ctx.render("employee", await this.getExtendedViewModel(ctx, extendedBody));
            return;
        }
        
        await ctx.redirect(`/Employer/${employerId}/Employee/${employeeId}?status=Employee details saved&statusType=success`);
    }
    
    async request60(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}`;
        let response = await apiWrapper.get(ctx, apiRoute);

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

        await ctx.render("download-p60", await this.getExtendedViewModel(ctx, body));
    }
    
    async downloadP60(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let body = ctx.request.body;
        let year = body.Year;
        let apiRoute = `/Report/P60/run?EmployerKey=${employerId}&EmployeeKey=${employeeId}&TaxYear=${year}&TransformDefinitionKey=P60-${year}-Pdf`;

        let response = await apiWrapper.getFile(ctx, apiRoute);

        ctx.set("Content-disposition", "attachment; filename=p60.pdf");
        ctx.set("Content-type", "application/pdf");
        ctx.body = response.body;
    }

    getP45PayInstruction(instructions) {
        let p45Instruction = instructions.find(pi => {
            return pi.ObjectType === "P45PayInstruction";
        });

        return p45Instruction;
    }

    getNormalGroupedPayInstructions(instructions) {
        let filtered = instructions.filter(i => i.ObjectType.toLowerCase().indexOf("ytd") === -1);
        let grouped = this.getGroupedPayInstructions(filtered);

        return this.getProjectedPayInstructions(grouped);
    }

    getYTDGroupedPayInstructions(instructions) {
        let filtered = instructions.filter(i => i.ObjectType.toLowerCase().indexOf("ytd") !== -1);
        let grouped = this.getGroupedPayInstructions(filtered);

        return this.getProjectedPayInstructions(grouped);
    }

    getGroupedPayInstructions(instructions) {
        let groupedPayInstructions = _.groupBy(instructions, (pi) => {
            return pi.ObjectType;
        });

        return groupedPayInstructions;
    }

    getProjectedPayInstructions(groupedPayInstructions) {
        let projectedPayInstructions = Object.keys(groupedPayInstructions).map(key => {
            let instructions = groupedPayInstructions[key];
    
            return {
                InstructionType: key,
                Instructions: instructions
            };
        });
        
        return projectedPayInstructions;
    }
};