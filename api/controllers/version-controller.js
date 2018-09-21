const BaseController = require("./base-controller");
const PackageJson = require("../../package.json");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class VersionController extends BaseController {
    async get(ctx) {
        let healthCheckResponse = await apiWrapper.get("/Healthcheck");

        ctx.body = {
            version: PackageJson.version,
            apiVersion: healthCheckResponse.HealthCheck.Version
        };
    }
}