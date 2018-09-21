const BaseController = require("./base-controller");
const SetupController = require("./setup-controller");

module.exports = class RootController extends BaseController {
    async hasBeenSetup(ctx) {
        let cookie = ctx.cookies.get(SetupController.cookieKey);
        let hasBeenSetup = cookie !== undefined && cookie !== null;

        ctx.body = {
            hasBeenSetup: hasBeenSetup
        };
    }
};