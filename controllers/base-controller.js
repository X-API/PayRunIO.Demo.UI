const PackageJson = require('../package.json');
const ApiWrapper = require("../services/api-wrapper");

const apiWrapper = new ApiWrapper();

module.exports = class BaseController {
    static async getExtendedViewModel(vm) {
        let healthCheckResponse = await apiWrapper.get("/Healthcheck");
        
        return Object.assign(vm, {
            version: PackageJson.version,
            apiVersion: healthCheckResponse.HealthCheck.Version
        });
    }
};