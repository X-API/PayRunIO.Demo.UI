const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class PaySlipController extends BaseController {
    async getPaySlipData(ctx) {
        let employerId = ctx.params.employerId;
        let code = ctx.params.code;
        let taxYear = ctx.params.taxYear;
        let paymentDate = ctx.params.paymentDate
        let paySchedule = ctx.params.paySchedule

        let apiRoute = `/Report/PAYSLIP3/run?EmployerKey=${employerId}&TaxYear=${taxYear}&PayScheduleKey=${paySchedule}&paymentDate=${paymentDate}&EmployeeCodes=${code}`;
        let response = await apiWrapper.get(ctx, apiRoute);

        ctx.type = "text/plain; charset=utf-8";
        ctx.body = JSON.stringify(response.Payslip3, null, 4);
    }
};

module.exports = class PaySlipController extends BaseController {
    async getPaySlipPdf(ctx) {
        let employerId = ctx.params.employerId;
        let code = ctx.params.code;
        let taxYear = ctx.params.taxYear;
        let paymentDate = ctx.params.paymentDate
        let paySchedule = ctx.params.paySchedule

        let apiRoute = `/Report/PAYSLIP3/run?EmployerKey=${employerId}&TaxYear=${taxYear}&PayScheduleKey=${paySchedule}&paymentDate=${paymentDate}&EmployeeCodes=${code}&TransformDefinitionKey=Payslip-A5-Basic-Pdf`;
        let response = await apiWrapper.get(ctx, apiRoute);

        ctx.type = "application/pdf";
        ctx.body = response;
    }
};