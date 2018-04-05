const BaseController = require("./base-controller");

module.exports = class RootController {
    async getRootView(ctx) {
        await ctx.render("index", await BaseController.getExtendedViewModel({ title: "Get started" }));
    }
};