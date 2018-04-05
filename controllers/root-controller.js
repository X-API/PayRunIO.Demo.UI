const BaseController = require("./base-controller");

module.exports = class RootController extends BaseController {
    async getRootView(ctx) {
        await ctx.render("index", await this.getExtendedViewModel({ title: "Get started" }));
    }
};