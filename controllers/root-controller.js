const BaseController = require("./base-controller");
const SetupController = require("./setup-controller");

module.exports = class RootController extends BaseController {
    async getRootView(ctx) {
        let cookie = ctx.cookies.get(SetupController.cookieKey);
        let hasBeenSetup = cookie !== undefined && cookie !== null;

        await ctx.render("index", await this.getExtendedViewModel(ctx, { 
            title: "Get started",
            hasBeenSetup: hasBeenSetup
        }));
    }
};