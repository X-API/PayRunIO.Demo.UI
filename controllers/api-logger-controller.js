const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class APILoggerController extends BaseController {
    async getView(ctx) {
        await ctx.render("api-logs", await this.getExtendedViewModel(ctx, { title: "API calls", HideAPICallsLink: true }));
    }

    async getData(ctx) {
        let data = ctx.session.apiCalls;

        if (!data) {
            ctx.body = data;
            return;
        }

        let filteredData = data.filter(x => !x.uri.trim().toLowerCase().endsWith("/healthcheck"));

        let reversed = filteredData.reverse();

        ctx.body = reversed;
    }

    async postAPICallsOpenStatus(ctx) {
        let body = ctx.request.body;

        ctx.session.openAPICalls = body.open === "true";
    }

    async postAPICallsPanelSize(ctx) {
        let body = ctx.request.body;

        ctx.session.apiCallsHeight = body.size;
    }    
};