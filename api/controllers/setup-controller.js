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
            body = {
                Environment: "",
                ConsumerKey: "",
                ConsumerSecret: ""
            };
        }

        ctx.body = body;
    }

    async hasBeenSetup(ctx) {
        ctx.body = {
            hasBeenSetup: this.hasApiBeenSetup(ctx)
        };
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

        ctx.body = {
            valid: true
        };
    }

    hasApiBeenSetup(ctx) {
        let cookie = ctx.cookies.get(SetupController.cookieKey);
        let hasBeenSetup = cookie !== undefined && cookie !== null;

        return hasBeenSetup;
    }    
};