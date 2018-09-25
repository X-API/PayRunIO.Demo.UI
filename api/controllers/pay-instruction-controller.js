const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

let apiWrapper = new ApiWrapper();

module.exports = class PayInstructionController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.id;

        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;

        let response = await apiWrapper.get(apiRoute);

        let instructionType = Object.keys(response)[0];

        let body = Object.assign(response[instructionType], {
            Id: id,
            EmployeeId: employeeId,
            EmployerId: employerId,
            InstructionType: instructionType,
        });

        let instructionTypeInstance = this.getInstructionInstance(instructionType);
        let instructionTypeExtendedViewModel = await instructionTypeInstance.extendViewModel(body);        

        ctx.body = instructionTypeExtendedViewModel;
    }

    async post(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let body = ctx.request.body;
        let instructionType = body.InstructionType;
        let cleanBody = this.getInstructionInstance(instructionType).parseForApi(body);
        let request = {};

        request[instructionType] = cleanBody;

        let response = null;

        if (body.Id) {
            let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${body.Id}`;

            response = await apiWrapper.put(apiRoute, request);
        }
        else {
            let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;

            response = await apiWrapper.post(apiRoute, request);
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay instruction saved",
                    type: "success"
                }
            };
        }
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let payInstructionId = ctx.params.id;

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

    getInstructionInstance(type) {
        let Instruction;

        if (type.toLowerCase().indexOf("ytd") !== -1) {
            Instruction = require(`../services/payInstructions/year-to-date/${type}`);
        }
        else {
            Instruction = require(`../services/payInstructions/normal/${type}`);
        }

        return new Instruction();        
    }
};