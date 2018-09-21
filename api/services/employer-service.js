const ApiWrapper = require("./api-wrapper");
const Flatten = require("array-flatten");
const PaySchedulesQuery = require("../queries/pay-schedules-query");

const apiWrapper = new ApiWrapper();

module.exports = class EmployerService {
    async getPaySchedules(employerId) {
        let queryStr = JSON.stringify(PaySchedulesQuery).replace("$$EmployerKey$$", employerId);
        let query = JSON.parse(queryStr);
        return await apiWrapper.query(query);
    }

    async getPayRuns(employerId, schedules) {
        let items = await Promise.all(schedules.PaySchedulesTable.PaySchedule.map(async schedule => {
            let runs = await apiWrapper.getAndExtractLinks(`Employer/${employerId}/PaySchedule/${schedule.Key}/PayRuns`);

            return runs.map(run => {
                return Object.assign(run, {
                    ScheduleId: schedule.Key,
                    ScheduleName: schedule.Name
                });
            });
        }));

        return Flatten(items);
    }
};