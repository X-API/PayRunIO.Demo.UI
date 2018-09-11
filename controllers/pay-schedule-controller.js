const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

const apiWrapper = new ApiWrapper();

module.exports = class PayScheduleController extends BaseController {
    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let response = null;

        if (body.Id) {
            let url = `Employer/${employerId}/paySchedule/${body.Id}`;

            body.Id = null;

            response = await apiWrapper.put(url, { PaySchedule: body });
        }
        else {
            response = await apiWrapper.post(`Employer/${employerId}/PaySchedules`, { PaySchedule: body });
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay schedule saved",
                    type: "success"
                }
            };
        }
    }

    async deleteSchedule(ctx) {
        let employerId = ctx.params.employerId;
        let payScheduleId = ctx.params.payScheduleId;
        
        let apiRoute = `/Employer/${employerId}/PaySchedule/${payScheduleId}`;

        let response = await apiWrapper.delete(apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay schedule deleted",
                    type: "success"
                }
            };
        }
    }
};