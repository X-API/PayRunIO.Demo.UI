const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
let apiWrapper = new ApiWrapper();

module.exports = class P45InstructionController extends BaseController {
    async postNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let body = ctx.request.body;
        let apiRoute = `Employer/${employerId}/Employee/${employeeId}/PayInstructions`;

        let response = await apiWrapper.post(apiRoute, { P45PayInstruction: body });

        if (ValidationParser.containsErrors(response)) {
            return;
        }

        await ctx.redirect(`/employer/${employerId}/employee/${employeeId}?status=P45 instruction saved&statusType=success#p45-instruction`);
    }

    async postExistingInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.id;
        let body = ctx.request.body;
        let apiRoute = `Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;

        let response = await apiWrapper.put(apiRoute, { P45PayInstruction: body });

        if (ValidationParser.containsErrors(response)) {
            return;
        }

        await ctx.redirect(`/employer/${employerId}/employee/${employeeId}?status=P45 instruction saved&statusType=success#p45-instruction`);
    }
};