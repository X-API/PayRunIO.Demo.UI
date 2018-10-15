const ApiWrapper = require("./api-wrapper");
const Flatten = require("array-flatten");
const PaySchedulesQuery = require("../queries/pay-schedules-query");

const apiWrapper = new ApiWrapper();

module.exports = class EmployerService {
    async getPaySchedules(ctx, employerId) {
        let queryStr = JSON.stringify(PaySchedulesQuery).replace("$$EmployerKey$$", employerId);
        let query = JSON.parse(queryStr);
        return await apiWrapper.query(ctx, query);
    }

    async getPayRuns(ctx, employerId, schedules) {
        let items = await Promise.all(schedules.PaySchedulesTable.PaySchedule.map(async schedule => {
            let runs = await apiWrapper.getAndExtractLinks(ctx, `Employer/${employerId}/PaySchedule/${schedule.Key}/PayRuns`);

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