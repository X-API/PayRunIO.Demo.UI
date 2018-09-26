const PackageJson = require("../package.json");
const ApiWrapper = require("../services/api-wrapper");

const apiWrapper = new ApiWrapper();

module.exports = class BaseController {
    async getExtendedViewModel(ctx, vm) {
        let healthCheckResponse = await apiWrapper.get(ctx, "/Healthcheck");

        let body = ctx.session.body || {};

        if (!vm.errors) {
            vm.errors = ctx.session.errors || [];
        }

        vm.version = PackageJson.version;
        vm.apiVersion = healthCheckResponse.HealthCheck.Version;
        vm.openAPICalls = ctx.session.openAPICalls;    
        vm.apiCallsHeight = ctx.session.apiCallsHeight || 300;  

        ctx.session.body = null;
        ctx.session.errors = null;

        return Object.assign(body, vm);
    }   
};