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
        let instructionType = ctx.query.type || ctx.session.body.InstructionType;

        if (!instructionType) {
            throw new Error("specify the `type` query string param when adding a new pay instruction");
        }

        let body = {
            title: "Pay instruction",
            EmployeeId: employeeId,
            EmployerId: employerId,
            InstructionType: instructionType,
            EnableForm: await this.canInstructionBeAdded({ 
                employerId,
                employeeId, 
                instructionType
            }),
            MinStartDate: await this.getMinStartDateForNewInstruction({ 
                employerId, 
                employeeId, 
                type: instructionType
            }),
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Pay instruction" }
            ]
        };

        if (ctx.query && ctx.query.type) {
            body.InstructionType = ctx.query.type;
        }

        await ctx.render("pay-instruction", await this.getExtendedViewModel(ctx, body));
    }

    async addNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let body = ctx.request.body;
        let instructionType = body.InstructionType;
        let cleanBody = PayInstructionUtils.parse(body);

        let response = await apiWrapper.post(apiRoute, { 
            instructionType: cleanBody 
        });

        let employeeRoute = `/employer/${employerId}/employee/${employeeId}`;

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);

            ctx.redirect(employeeRoute + "/payInstruction/new");
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
        let instructionType = Object.keys(response)[0];

        let body = Object.assign(response[instructionType], {
            title: "Pay instruction",
            Id: id,
            EnableForm: true,
            EmployeeId: employeeId,
            EmployerId: employerId,
            InstructionType: instructionType,
            MinStartDate: await this.getMinStartDateForNewInstruction({ 
                employerId: employerId, 
                employeeId: employeeId, 
                payInstructionId: id, 
                type: instructionType
            }),
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Pay instruction" }
            ]
        });

        await ctx.render("pay-instruction", await this.getExtendedViewModel(ctx, body));
    }

    async saveInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;
        let body = ctx.request.body;
        let cleanedBody = PayInstructionUtils.parse(body); // todo: move this into the generic instruction class. 

        let response = await apiWrapper.put(apiRoute, { SalaryPayInstruction: cleanedBody });

        let employeeRoute = `/employer/${employerId}/employee/${employeeId}`;

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(apiRoute);
            return;
        }

        await ctx.redirect(employeeRoute + "?status=Pay instruction saved&statusType=success#instructions");        
    }

    async deleteInstruction(ctx) {

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
        const Instruction = require(`../services/payInstructions/${type}`);

        return new Instruction();        
    }
};