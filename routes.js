const router = require("koa-router")();
const RootController = require("./controllers/root-controller");
const EmployerController = require("./controllers/employer-controller");
const EmployeeController = require("./controllers/employee-controller");
const PayScheduleController = require("./controllers/pay-schedule-controller");
const PayInstructionController = require("./controllers/pay-instruction-controller");
const PayRunController = require("./controllers/pay-run-controller");
const CommentaryController = require("./controllers/commentary-controller");
const PaySlipController = require("./controllers/pay-slip-controller");
const JobController = require("./controllers/job-controller");
const RTIController = require("./controllers/rti-controller");
const APILoggerController = require("./controllers/api-logger-controller");
const PensionController = require("./controllers/pension-controller");
const P45InstructionController = require("./controllers/p45-instruction-controller");
const SetupController = require("./controllers/setup-controller");
const VersionController = require("./controllers/version-controller");
const fs = require("fs");

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
let p45InstructionController = new P45InstructionController();
let setupController = new SetupController();
let versionController = new VersionController();

router
    // root/get started
    .get("/", async ctx => {
        await ctx.render("aurelia");
    })

    // version
    .get("/api/version", async ctx => await versionController.get(ctx))

    // setup
    .get("/api/has-been-setup", async ctx => await rootController.hasBeenSetup(ctx))    
    .get("/api/setup", async ctx => await setupController.get(ctx))
    .post("/api/setup", async ctx => await setupController.post(ctx))    

    // api calls
    .get("api/api-calls", async ctx => await apiLoggerController.getView(ctx))
    .get("api/api-calls/data", async ctx => await apiLoggerController.getData(ctx))
    .post("api/api-calls/is-open", async ctx => await apiLoggerController.postAPICallsOpenStatus(ctx))
    .post("api/api-calls/size", async ctx => await apiLoggerController.postAPICallsPanelSize(ctx))

    // employer
    .get("/api/employers", async ctx => await employerController.getEmployers(ctx))
    .get("/api/employer/:id", async ctx => await employerController.getEmployerDetails(ctx))
    .post("/api/employer/:id", async ctx => await employerController.saveEmployerDetails(ctx))
    .post("/api/employer", async ctx => await employerController.addNewEmployer(ctx))

    // pay schedule
    .post("/api/employer/:employerId/paySchedule", async ctx => await payScheduleController.post(ctx))
    .post("/api/employer/:employerId/paySchedule/:payScheduleId/delete", async ctx => await payScheduleController.deleteSchedule(ctx))

    // pension
    .post("/api/employer/:employerId/pension", async ctx => await pensionController.post(ctx))
    .patch("/api/employer/:employerId/pension/:id", async ctx => await pensionController.patch(ctx))
    .delete("/api/employer/:employerId/pension/:id", async ctx => await pensionController.delete(ctx))

    // employee
    .get("api/employer/:employerId/employee/new", async ctx => await employeeController.requestNewEmployee(ctx))
    .post("api/employer/:employerId/employee", async ctx => await employeeController.addNewEmployee(ctx))
    .get("api/employer/:employerId/employee/:employeeId", async ctx => await employeeController.getEmployeeDetails(ctx))
    .post("api/employer/:employerId/employee/:employeeId", async ctx => await employeeController.saveEmployeeDetails(ctx))
    //.get("/employer/:employerId/employee/:employeeId/leaver-details", async ctx => { })
    //.get("/employer/:employerId/employee/:employeeId/p45", async ctx => { })
    .get("api/employer/:employerId/employee/:employeeId/p60", async ctx => await employeeController.request60(ctx))
    .post("api/employer/:employerId/employee/:employeeId/p60", async ctx => await employeeController.downloadP60(ctx))
    //.post("/employer/:employerId/employee/:employeeId/delete", async ctx => { })

    // pay instruction
    .get("api/employer/:employerId/employee/:employeeId/payInstruction/new", async ctx => await payInstructionController.requestNewInstruction(ctx))
    .post("api/employer/:employerId/employee/:employeeId/payInstruction", async ctx => payInstructionController.addNewInstruction(ctx))
    .get("api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.getInstruction(ctx))
    .post("api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.saveInstruction(ctx))
    .post("api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId/delete", async ctx => payInstructionController.deleteInstruction(ctx))

    // pay run
    .get("api/employer/:employerId/payRun", async ctx => await payRunController.requestNewRun(ctx))
    .get("api/employer/:employerId/reRun", async ctx => await payRunController.requestReRun(ctx))
    .post("api/employer/:employerId/payRun", async ctx => await payRunController.startNewRun(ctx))
    .get("api/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId", async ctx => await payRunController.getPayRunInfo(ctx))
    .post("api/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId/delete", async ctx => await payRunController.deletePayRun(ctx))
    .post("api/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId/rerun", async ctx => await payRunController.rerunPayRun(ctx))

    // comentary
    .get("api/employer/:employerId/employee/:employeeId/commentary/:commentaryId", async ctx => await commentaryController.getCommentary(ctx))

    // pay slip
    .get("api/employer/:employerId/employee/:employeeId/paySlipData/:code/:taxPeriod/:taxYear", async ctx => await paySlipController.getPaySlipData(ctx))

    // rti transaction
    .get("api/employer/:employerId/rtiTransaction", async ctx => await rtiController.getNewRtiInstruction(ctx))
    .post("api/employer/:employerId/rtiTransaction", async ctx => await rtiController.postNewRtiInstruction(ctx))
    .get("api/employer/:employerId/rtiTransaction/:rtiTransactionId", async ctx => await rtiController.getTransactionResults(ctx))

    // job
    .get("api/employer/:employerId/job/:jobId/:type", async ctx => await jobController.getJobDetails(ctx))

    // p45 pay instruction
    .post("api/employer/:employerId/Employee/:employeeId/P45Instruction", async ctx => await p45InstructionController.postNewInstruction(ctx))
    .post("api/employer/:employerId/Employee/:employeeId/P45Instruction/:id", async ctx => await p45InstructionController.postExistingInstruction(ctx))
;

module.exports = router.routes();