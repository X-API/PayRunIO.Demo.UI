const ApiWrapper = require("./api-wrapper");

const apiWrapper = new ApiWrapper();

module.exports = class EmployerService {
    async getPaySchedules(employerId) {
        return await apiWrapper.getAndExtractLinks(`Employer/${employerId}/PaySchedules`);
    }
};