const BaseController = require("./base-controller");
const EmployerService = require("../services/employer-service");

let employerService = new EmployerService();

module.exports = class PaySchedulesController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let paySchedules = await employerService.getPaySchedules(ctx, employerId);

        ctx.body = paySchedules.PaySchedulesTable.PaySchedule;
    }
};