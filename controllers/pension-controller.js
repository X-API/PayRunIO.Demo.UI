const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const PensionUtils = require("../services/pension-utils");

let apiWrapper = new ApiWrapper();

module.exports = class PensionController extends BaseController {
    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let response = null;

        console.log(body);

        if (body.Id) {
            let url = `Employer/${employerId}/Pension/${body.Id}`;

            response = await apiWrapper.put(url, { Pension: PensionUtils.parse(body) });
        }
        else {
            let url = `Employer/${employerId}/Pensions`;

            response = await apiWrapper.post(url, { Pension: PensionUtils.parse(body) });
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pension saved",
                    type: "success"
                }
            };
        }
    }

    async patch(ctx) {
        let id = ctx.params.id;
        let employerId = ctx.params.employerId;

        await apiWrapper.patch(`/Employer/${employerId}`, {
            Employer: {
                AutoEnrolment: {
                    Pension: {
                        "@href": `/Employer/${employerId}/Pension/${id}`
                    }
                }
            }
        });

        ctx.body = { 
            status: {
                message: "Pension defaulted for Auto Enrolment",
                type: "success"                
            } 
        };
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let id = ctx.params.id;
        let apiRoute = `/Employer/${employerId}/Pension/${id}`;
        let response = await apiWrapper.delete(apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pension deleted",
                    type: "success"                
                }
            };
        }        
    }    
};