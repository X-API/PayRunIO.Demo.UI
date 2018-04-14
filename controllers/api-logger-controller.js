const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class APILoggerController extends BaseController {
    async getView(ctx) {
        await ctx.render("api-logs", await this.getExtendedViewModel(ctx, { title: "API calls", HideAPICallsLink: true }));
    }

    async getData(ctx) {
        let data = ctx.session.apiCalls
            .filter(x => !x.request.uri.trim().toLowerCase().endsWith("/healthcheck"));

        let reversed = data.reverse().map(x => {
            x.request.stringifiedHeaders = JSON.stringify(x.request.headers, null, 4);

            return x;
        });

        ctx.body = reversed;        
    }
};