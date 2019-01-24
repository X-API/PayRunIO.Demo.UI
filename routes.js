const router = require("koa-router")();
const RootController = require("./controllers/root-controller");
const EmployerController = require("./controllers/employer-controller");
const EmployeeController = require("./controllers/employee-controller");
const PayScheduleController = require("./controllers/pay-schedule-controller");
const PayInstructionController = require("./controllers/pay-instruction-controller");
const PayRunController = require("./controllers/pay-run-controller");
const CommentaryController = require("./controllers/commentary-controller");
const PaySlipController = require("./controllers/report-controller");
const JobController = require("./controllers/job-controller");
const RTIController = require("./controllers/rti-controller");
const APILoggerController = require("./controllers/api-logger-controller");
const PensionController = require("./controllers/pension-controller");
const HolidaySchemeController = require("./controllers/holiday-scheme-controller");
const SetupController = require("./controllers/setup-controller");

let rootController = new RootController();
let employerController = new EmployerController();
let employeeController = new EmployeeController();
let payScheduleController = new PayScheduleController();
let payInstructionController = new PayInstructionController();
let payRunController = new PayRunController();
let commentaryController = new CommentaryController();
let paySlipController = new PaySlipController();
let jobController = new JobController();
let rtiController = new RTIController();
let apiLoggerController = new APILoggerController();
let pensionController = new PensionController();
let holidaySchemeController = new HolidaySchemeController();
let setupController = new SetupController();

router
    // root/get started
    .get("/", async ctx => await rootController.getRootView(ctx))

    // api calls
    .get("/api-calls", async ctx => await apiLoggerController.getView(ctx))
    .get("/api-calls/data", async ctx => await apiLoggerController.getData(ctx))
    .post("/api-calls/is-open", async ctx => await apiLoggerController.postAPICallsOpenStatus(ctx))
    .post("/api-calls/size", async ctx => await apiLoggerController.postAPICallsPanelSize(ctx))

    // employer
    .get("/employer", async ctx => await employerController.getEmployers(ctx))
    .post("/employer", async ctx => await employerController.addNewEmployer(ctx))
    .get("/employer/new", async ctx => await employerController.requestNewEmployer(ctx))
    .get("/employer/:id", async ctx => await employerController.getEmployerDetails(ctx))
    .post("/employer/:id", async ctx => await employerController.saveEmployerDetails(ctx))
    //.post("/employer/:id/delete", async ctx => { })

    // pay schedule
    .get("/employer/:employerId/paySchedule/new", async ctx => await payScheduleController.requestNewSchedule(ctx))
    .post("/employer/:employerId/paySchedule", async ctx => await payScheduleController.addNewSchedule(ctx))
    .get("/employer/:employerId/paySchedule/:payScheduleId", async ctx => await payScheduleController.getScheduleDetails(ctx))
    .post("/employer/:employerId/paySchedule/:payScheduleId", async ctx => await payScheduleController.saveScheduleDetails(ctx))
    .post("/employer/:employerId/paySchedule/:payScheduleId/delete", async ctx => await payScheduleController.deleteSchedule(ctx))

    // employee
    .get("/employer/:employerId/employee/new", async ctx => await employeeController.requestNewEmployee(ctx))
    .post("/employer/:employerId/employee", async ctx => await employeeController.addNewEmployee(ctx))
    .get("/employer/:employerId/employee/:employeeId", async ctx => await employeeController.getEmployeeDetails(ctx))
    .post("/employer/:employerId/employee/:employeeId", async ctx => await employeeController.saveEmployeeDetails(ctx))
    .get("/employer/:employerId/employee/:employeeId/leaver", async ctx =>  await employeeController.requestNewLeaver(ctx))
    .post("/employer/:employerId/employee/:employeeId/leaver", async ctx =>  await employeeController.saveNewLeaver(ctx))
    .get("/employer/:employerId/employee/:employeeId/p60", async ctx => await employeeController.request60(ctx))
    .post("/employer/:employerId/employee/:employeeId/p60", async ctx => await employeeController.downloadP60(ctx))
    .post("/employer/:employerId/employee/:employeeId/delete", async ctx => { })

    // pay instruction
    .get("/employer/:employerId/employee/:employeeId/payInstruction/new", async ctx => await payInstructionController.requestNewInstruction(ctx))
    .post("/employer/:employerId/employee/:employeeId/payInstruction", async ctx => payInstructionController.addNewInstruction(ctx))
    .get("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.getInstruction(ctx))
    .post("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.saveInstruction(ctx))
    .post("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId/delete", async ctx => payInstructionController.deleteInstruction(ctx))

    // pay run
    .get("/employer/:employerId/payRun", async ctx => await payRunController.requestNewRun(ctx))
    .get("/employer/:employerId/reRun", async ctx => await payRunController.requestReRun(ctx))
    .post("/employer/:employerId/payRun", async ctx => await payRunController.startNewRun(ctx))
    .get("/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId", async ctx => await payRunController.getPayRunInfo(ctx))
    .post("/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId/delete", async ctx => await payRunController.deletePayRun(ctx))
    .post("/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId/rerun", async ctx => await payRunController.rerunPayRun(ctx))

    // comentary
    .get("/employer/:employerId/employee/:employeeId/commentary/:commentaryId", async ctx => await commentaryController.getCommentary(ctx))

    // pay slip
    .get("/employer/:employerId/employee/:employeeId/paySlipData/:code/:taxYear/:paymentDate/:paySchedule", async ctx => await paySlipController.getPaySlipData(ctx))
    .get("/employer/:employerId/employee/:employeeId/paySlipPdf/:code/:taxYear/:paymentDate/:paySchedule", async ctx => await paySlipController.getPaySlipPdf(ctx))
    .get("/employer/:employerId/report/:reportKey", async ctx => await paySlipController.getReport(ctx))


    // rti transaction
    .get("/employer/:employerId/rtiTransaction", async ctx => await rtiController.getNewRtiInstruction(ctx))
    .post("/employer/:employerId/rtiTransaction", async ctx => await rtiController.postNewRtiInstruction(ctx))
    .get("/employer/:employerId/rtiTransaction/:rtiTransactionId", async ctx => await rtiController.getTransactionResults(ctx))

    // job
    .get("/employer/:employerId/job/:jobId/:type", async ctx => await jobController.getJobDetails(ctx))

    // pension
    .get("/employer/:employerId/pension", async ctx => await pensionController.getNewPension(ctx))
    .post("/employer/:employerId/pension", async ctx => await pensionController.postNewPension(ctx))
    .get("/employer/:employerId/pension/:id", async ctx => await pensionController.getExistingPension(ctx))
    .post("/employer/:employerId/pension/:id", async ctx => await pensionController.postExistingPension(ctx))
    .post("/employer/:employerId/pension/:id/delete", async ctx => await pensionController.postDeletePension(ctx))
    .post("/employer/:employerId/pension/:id/ae-default", async ctx => await pensionController.postAEDefault(ctx))

    // holiday schemes
    .get("/employer/:employerId/holidayScheme", async ctx => await holidaySchemeController.getNewHolidayScheme(ctx))
    .get("/employer/:employerId/holidayScheme", async ctx => await holidaySchemeController.getNewHolidayScheme(ctx))
    .post("/employer/:employerId/holidayScheme", async ctx => await holidaySchemeController.postNewHolidayScheme(ctx))
    .get("/employer/:employerId/holidayScheme/:id", async ctx => await holidaySchemeController.getExistingHolidayScheme(ctx))
    .post("/employer/:employerId/holidayScheme/:id", async ctx => await holidaySchemeController.postExistingHolidayScheme(ctx))
    .post("/employer/:employerId/holidayScheme/:id/delete", async ctx => await holidaySchemeController.postDeleteHolidayScheme(ctx))

    // setup
    .get("/setup", async ctx => await setupController.get(ctx))
    .get("/setup/revoke", async ctx => await setupController.revoke(ctx))
    .post("/setup", async ctx => await setupController.post(ctx))
;

module.exports = router.routes();