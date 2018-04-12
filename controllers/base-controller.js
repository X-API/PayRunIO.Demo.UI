const PackageJson = require('../package.json');
const ApiWrapper = require("../services/api-wrapper");

const apiWrapper = new ApiWrapper();

module.exports = class BaseController {
    async getExtendedViewModel(ctx, vm) {
        let healthCheckResponse = await apiWrapper.get("/Healthcheck");

        let body = ctx.session.body || {};
        let errors = ctx.session.errors || [];

        return Object.assign(body, vm, {
            errors: errors,
            version: PackageJson.version,
            apiVersion: healthCheckResponse.HealthCheck.Version
        });
    }   
};