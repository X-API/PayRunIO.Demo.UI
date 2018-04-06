const ApiWrapper = require("./api-wrapper");
const Flatten = require("array-flatten");

const apiWrapper = new ApiWrapper();

module.exports = class EmployerService {
    async getPaySchedules(employerId) {
        return await apiWrapper.getAndExtractLinks(`Employer/${employerId}/PaySchedules`);
    }

    async getPayRuns(employerId, schedules) {
        let items = await Promise.all(schedules.map(async schedule => {
            let runs = await apiWrapper.getAndExtractLinks(`Employer/${employerId}/PaySchedule/${schedule.Id}/PayRuns`);

            return runs;
        }));

        return Flatten(items);
    }
};