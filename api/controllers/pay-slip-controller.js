const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class PaySlipController extends BaseController {
    async getPaySlipData(ctx) {
        let employerId = ctx.params.employerId;
        let code = ctx.params.code;
        let taxPeriod = ctx.params.taxPeriod;
        let taxYear = ctx.params.taxYear;

        let apiRoute = `/Report/PAYSLIP/run?EmployerKey=${employerId}&TaxYear=${taxYear}&TaxPeriod=${taxPeriod}&EmployeeCodes=${code}`;
        let response = await apiWrapper.get(ctx, apiRoute);

        ctx.type = "text/plain; charset=utf-8";
        ctx.body = JSON.stringify(response.PayslipReport, null, 4);
    }

    async getPaySlipPdf(ctx) {
        let employerId = ctx.params.employerId;
        let code = ctx.params.code;
        let taxYear = ctx.params.taxYear;
        let paymentDate = ctx.params.paymentDate
        let paySchedule = ctx.params.paySchedule

        let apiRoute = `/Report/PAYSLIP3/run?EmployerKey=${employerId}&TaxYear=${taxYear}&PayScheduleKey=${paySchedule}&paymentDate=${paymentDate}&EmployeeCodes=${code}&TransformDefinitionKey=Payslip-A5-Basic-Pdf`;
        let response = await apiWrapper.getFile(ctx, apiRoute);

        ctx.set("Content-type", "application/pdf");
        ctx.body = response.body;
    }
};