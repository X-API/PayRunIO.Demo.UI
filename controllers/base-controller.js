const PackageJson = require('../package.json');
const ApiWrapper = require("../services/api-wrapper");

const apiWrapper = new ApiWrapper();

module.exports = class BaseController {
    async getExtendedViewModel(vm) {
        let healthCheckResponse = await apiWrapper.get("/Healthcheck");

        return Object.assign({}, vm, {
            version: PackageJson.version,
            apiVersion: healthCheckResponse.HealthCheck.Version
        });
    }

    async getExtendedViewModelFromPreviousPost(ctx, vm) {
        let healthCheckResponse = await apiWrapper.get("/Healthcheck");
        let body = ctx.session && ctx.session.body ? ctx.session.body : {};
        let errors = ctx.session && ctx.session.errors ? ctx.session.errors : [];

        ctx.session.body = {};
        ctx.session.errors = [];

        return Object.assign(body, vm, {
            errors: errors,
            version: PackageJson.version,
            apiVersion: healthCheckResponse.HealthCheck.Version
        });
    }    
};