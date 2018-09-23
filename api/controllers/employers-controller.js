const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const EmployerQuery = require("../queries/employer-query");

let apiWrapper = new ApiWrapper();

module.exports = class EmployersController extends BaseController {
    async get(ctx) {
        let queryResponse = await apiWrapper.query(EmployerQuery);
        let employers = queryResponse.EmployerTable.Employer;

        ctx.body = employers;
    }
};