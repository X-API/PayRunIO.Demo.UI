const ApiWrapper = require("./api-wrapper");
const PaySchedulesQuery = require("../queries/pay-schedules-query");

const apiWrapper = new ApiWrapper();

module.exports = class EmployerService {
    async getPaySchedules(ctx, employerId) {
        let queryStr = JSON.stringify(PaySchedulesQuery).replace("$$EmployerKey$$", employerId);
        let query = JSON.parse(queryStr);
        return await apiWrapper.query(ctx, query);
    }
};