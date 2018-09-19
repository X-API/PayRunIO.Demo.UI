const BaseController = require("./base-controller");

module.exports = class APILoggerController extends BaseController {
    async get(ctx) {
        let data = ctx.session.apiCalls;

        if (!data) {
            ctx.body = data;
            return;
        }

        let filteredData = data.filter(x => !x.uri.trim().toLowerCase().endsWith("/healthcheck"));

        let reversed = filteredData.reverse();

        ctx.body = reversed;
    }   
};