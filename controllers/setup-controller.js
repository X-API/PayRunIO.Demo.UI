const BaseController = require("./base-controller");

module.exports = class SetupController extends BaseController {
    static get cookieKey() {
        return "setupCookieKey";
    }

    async get(ctx) {
        let body = ctx.cookies.get(SetupController.cookieKey);

        if (body) {
            body = JSON.parse(body);
        }
        else {
            body = {};
        }

        body.title = "Setup";

        await ctx.render("setup", await this.getExtendedViewModel(ctx, body));
    }

    async post(ctx) {
        let body = ctx.request.body;
        let stringifiedBody = JSON.stringify(body);

        ctx.cookies.set(SetupController.cookieKey, stringifiedBody, {
            path: "/",
            expires: new Date(2500, 1, 1),
            overwrite: true,
            httpOnly: false
        });

        await ctx.redirect("/employer");
    }
};