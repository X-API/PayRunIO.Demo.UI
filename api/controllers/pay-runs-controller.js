const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const PayRunsQuery = require("../queries/payruns-query");

let apiWrapper = new ApiWrapper();

module.exports = class PayRunsController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let queryStr = JSON.stringify(PayRunsQuery).replace("$$EmployerKey$$", employerId);
        let query = JSON.parse(queryStr);
        let paymentDates = await apiWrapper.query(ctx, query);

        ctx.body = paymentDates.PayRunsQuery.PayRuns;
    }
};