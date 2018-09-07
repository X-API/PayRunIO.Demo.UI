const BaseController = require("./base-controller");
const Globals = require("../Constants");

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
            body = {
                Environment: "",
                ConsumerKey: "",
                ConsumerSecret: ""
            };
        }

        ctx.body = body;
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

        Globals.setup(body);

        ctx.body = {
            valid: true
        };
    }
};