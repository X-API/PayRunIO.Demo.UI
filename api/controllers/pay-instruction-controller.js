const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

let apiWrapper = new ApiWrapper();

module.exports = class PayInstructionController extends BaseController {
    async addNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let body = ctx.request.body;
        let instructionType = body.InstructionType;
        let cleanBody = this.getInstructionInstance(instructionType).parseForApi(body);
        let request = {};

        request[instructionType] = cleanBody;

        let response = await apiWrapper.post(apiRoute, request);

        if (ctx.headers["x-requested-with"] === "XMLHttpRequest") {
            ctx.body = {
                Errors: ValidationParser.extractErrors(response)
            };
            return;
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);

            ctx.redirect("/payInstruction/new");
            return;
        }

        await this.redirectWithStatus(ctx, employerId, employeeId, instructionType);
    }

    async getInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;

        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;

        let response = await apiWrapper.get(apiRoute);
        let instructionType = Object.keys(response)[0];

        let body = Object.assign(response[instructionType], {
            title: "Pay instruction",
            Id: id,
            EnableForm: true,
            EmployeeId: employeeId,
            EmployerId: employerId,
            InstructionType: instructionType,
            MinStartDate: null,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Pay instruction" }
            ],
            layout: "modal"
        });

        let instructionTypeInstance = this.getInstructionInstance(instructionType);
        let extendedViewModel = await this.getExtendedViewModel(ctx, body);
        let instructionTypeExtendedViewModel = await instructionTypeInstance.extendViewModel(extendedViewModel);        

        await ctx.render("pay-instruction", instructionTypeExtendedViewModel);
    }

    async saveInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;
        let body = ctx.request.body;
        let instructionType = body.InstructionType;
        let cleanBody = this.getInstructionInstance(instructionType).parseForApi(body);
        let request = {};

        request[instructionType] = cleanBody;

        let response = await apiWrapper.put(apiRoute, request);

        if (ctx.headers["x-requested-with"] === "XMLHttpRequest") {
            ctx.body = {
                Errors: ValidationParser.extractErrors(response)
            };
            return;
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(apiRoute);
            return;
        }

        await this.redirectWithStatus(ctx, employerId, employeeId, instructionType);
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let payInstructionId = ctx.params.payInstructionId;

        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${payInstructionId}`;

        let response = await apiWrapper.delete(apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay Instruction deleted",
                    type: "success"                    
                }
            };
        }
    }

    async redirectWithStatus(ctx, employerId, employeeId, instructionType) {
        let employeeRoute = `/employer/${employerId}/employee/${employeeId}`;
        let hash = instructionType.toLowerCase().indexOf("ytd") !== -1 ? "#year-to-date-instructions" : "#instructions";
        
        await ctx.redirect(`${employeeRoute}?status=Pay instruction saved&statusType=success${hash}`);        
    }

    async canInstructionBeAdded({ employerId, employeeId, type }) {
        let instruction = this.getInstructionInstance(type);

        return instruction.canNewInstructionBeAdded(employerId, employeeId);
    }

    async getMinStartDateForNewInstruction({ employerId, employeeId, payInstructionId, type }) {
        let instruction = this.getInstructionInstance(type);

        return instruction.getMinStartDateForNewInstruction({
            employerId: employerId,
            employeeId: employeeId,
            payInstructionId: payInstructionId
        });
    }

    getInstructionInstance(type) {
        let Instruction;

        if (type.toLowerCase().indexOf("ytd") !== -1) {
            Instruction = require(`../services/payInstructions/yearToDate/${type}`);
        }
        else {
            Instruction = require(`../services/payInstructions/${type}`);
        }

        return new Instruction();        
    }
};