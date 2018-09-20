const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
let apiWrapper = new ApiWrapper();

module.exports = class P45InstructionController extends BaseController {
    async post(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let body = ctx.request.body;
        let response = null;

        if (body.Id) {
            let apiRoute = `Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;

            response = await apiWrapper.put(apiRoute, { P45PayInstruction: body });
        }
        else {
            let apiRoute = `Employer/${employerId}/Employee/${employeeId}/PayInstructions`;

            response = await apiWrapper.post(apiRoute, { P45PayInstruction: body });    
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "P45 Pay Instruction saved",
                    type: "success"
                }
            };
        }
    }
};