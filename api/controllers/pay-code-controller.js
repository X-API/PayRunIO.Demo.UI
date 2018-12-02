const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

let apiWrapper = new ApiWrapper();

module.exports = class PayCodeController extends BaseController {
    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let formattedBody = this.formatBodyForApi(body);        
        let response = null;

        if (body.Id) {
            let url = `Employer/${employerId}/PayCode/${body.Id}`;

            response = await apiWrapper.put(ctx, url, { PayCode: formattedBody });
        }
        else {
            let url = `Employer/${employerId}/PayCodes`;

            response = await apiWrapper.post(ctx, url, { PayCode: formattedBody });
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay code saved",
                    type: "success"
                }
            };
        }
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let id = ctx.params.id;
        let apiRoute = `/Employer/${employerId}/PayCode/${id}`;
        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Pay code deleted",
                    type: "success"
                }
            };
        }
    }

    formatBodyForApi(body) {
        let copy = JSON.parse(JSON.stringify(body));

        copy.Id = null;
        copy.employerId = null;
        copy.ObjectType = null;
        copy.NominalCode = {
            "@href": `/Employer/${body.employerId}/NominalCode/${body.NominalCode}`
        };

        return copy;
    }
};