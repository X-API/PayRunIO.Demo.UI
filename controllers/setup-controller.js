const BaseController = require("./base-controller");

module.exports = class SetupController extends BaseController {
    static get cookieKey() {
        return "setupCookieKey";
    }

    async get(ctx) {
        await ctx.render("setup", await this.getExtendedViewModel(ctx, {
            title: "Setup"
        }));
    }
};