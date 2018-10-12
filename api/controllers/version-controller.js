const BaseController = require("./base-controller");
const SetupController = require("./setup-controller");
const PackageJson = require("../../package.json");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();
let setupController = new SetupController();

module.exports = class VersionController extends BaseController {
    async get(ctx) {
        if (!setupController.hasApiBeenSetup(ctx)) {
            ctx.body = {};
            return;
        }
        
        let healthCheckResponse = await apiWrapper.get(ctx, "/Healthcheck");

        ctx.body = {
            version: PackageJson.version,
            apiVersion: healthCheckResponse.HealthCheck.Version
        };
    }
};