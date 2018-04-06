const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const PayInstructionUtils = require("../services/pay-instruction-utils");
const moment = require("moment");

const apiWrapper = new ApiWrapper();

module.exports = class PayInstructionController extends BaseController {
    async requestNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;

        let body = {
            title: "Add new salary pay instruction",
            EmployeeId: employeeId,
            EmployerId: employerId,
            MinStartDate: await this.getMinStartDateForNewPayInstruction(employerId, employeeId),
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Add new salary pay instruction" }
            ]
        };

        await ctx.render("pay-instruction", await this.getExtendedViewModel(body));
    }

    async addNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let body = ctx.request.body;
        let cleanedBody = PayInstructionUtils.parse(body);

        let response = await apiWrapper.post(apiRoute, { SalaryPayInstruction: cleanedBody });

        let employeeRoute = `/employer/${employerId}/employee/${employeeId}`;

        if (ValidationParser.containsErrors(response)) {
            let extendedBody = Object.assign(body, {
                title: "Add new salary pay instruction",
                errors: ValidationParser.extractErrors(response),
                EmployeeId: employeeId,
                EmployerId: employerId,
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Employer", Url: `/employer/${employerId}` },
                    { Name: "Employee", Url: employeeRoute },
                    { Name: "Add new salary pay instruction" }
                ]
            });            
            
            await ctx.render("pay-instruction", await this.getExtendedViewModel(extendedBody));
            return;
        }

        await ctx.redirect(employeeRoute + "?status=Pay instruction saved&statusType=success#instructions");
    }

    async getInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;

        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;

        let response = await apiWrapper.get(apiRoute);

        let body = Object.assign(response.SalaryPayInstruction, {
            title: "Salary pay instruction",
            Id: id,
            EmployeeId: employeeId,
            EmployerId: employerId,
            MinStartDate: await this.getMinStartDateForNewPayInstruction(employerId, employeeId, id),
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Salary pay instruction" }
            ]
        });

        await ctx.render("pay-instruction", await this.getExtendedViewModel(body));
    }

    async saveInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;
        let body = ctx.request.body;
        let cleanedBody = PayInstructionUtils.parse(body);

        let response = await apiWrapper.put(apiRoute, { SalaryPayInstruction: cleanedBody });

        let employeeRoute = `/employer/${employerId}/employee/${employeeId}`;

        if (ValidationParser.containsErrors(response)) {
            let extendedBody = Object.assign(body, {
                title: "Salary pay instruction",
                errors: ValidationParser.extractErrors(response),
                Id: id,
                EmployeeId: employeeId,
                EmployerId: employerId,
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Employer", Url: `/employer/${employerId}` },
                    { Name: "Employee", Url: employeeRoute },
                    { Name: "Salary pay instruction" }
                ]
            });            
            
            await ctx.render("pay-instruction", await this.getExtendedViewModel(extendedBody));
            return;
        }

        await ctx.redirect(employeeRoute + "?status=Pay instruction saved&statusType=success#instructions");        
    }

    async deleteInstruction(ctx) {

    }

    async getMinStartDateForNewPayInstruction(employerId, employeeId, payInstructionId) {
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let payInstructions = await apiWrapper.getAndExtractLinks(apiRoute);

        let filteredPayInstructions = payInstructions.filter(pi => pi.EndDate && pi.Id !== payInstructionId);

        if (filteredPayInstructions.length === 0) {
            return null;
        }

        let orderedPayInstructions = filteredPayInstructions.sort((a, b) => new Date(b.EndDate) - new Date(a.EndDate));
        let endDate = moment(orderedPayInstructions[0].EndDate);

        return endDate.add(1, "day").format("YYYY-MM-DD");
    }
};