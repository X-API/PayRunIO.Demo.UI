const router = require("koa-router")();
const RootController = require("./controllers/root-controller");
const EmployerController = require("./controllers/employer-controller");
const EmployeeController = require("./controllers/employee-controller");
const PayScheduleController = require("./controllers/pay-schedule-controller");
const PayInstructionController = require("./controllers/pay-instruction-controller");
const PayRunController = require("./controllers/pay-run-controller");
const PayRunsController = require("./controllers/pay-runs-controller");
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
let payRunsController = new PayRunsController();
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
    .get("/api/api-calls", async ctx => await apiLoggerController.get(ctx))

    // employer
    .get("/api/employers", async ctx => await employerController.getEmployers(ctx))
    .get("/api/employer/:id", async ctx => await employerController.getEmployerDetails(ctx))
    .post("/api/employer/:id", async ctx => await employerController.saveEmployerDetails(ctx))
    .post("/api/employer", async ctx => await employerController.addNewEmployer(ctx))

    // pay schedule
    .get("/api/employer/:employerId/paySchedule/:payScheduleId/next-pay-run", async ctx => await payScheduleController.getNextPayRun(ctx))
    .post("/api/employer/:employerId/paySchedule", async ctx => await payScheduleController.post(ctx))
    .post("/api/employer/:employerId/paySchedule/:payScheduleId/delete", async ctx => await payScheduleController.deleteSchedule(ctx))

    // job
    .get("/api/job/:jobId/:type", async ctx => await jobController.get(ctx))    

    // pension
    .post("/api/employer/:employerId/pension", async ctx => await pensionController.post(ctx))
    .patch("/api/employer/:employerId/pension/:id", async ctx => await pensionController.patch(ctx))
    .delete("/api/employer/:employerId/pension/:id", async ctx => await pensionController.delete(ctx))

    // employee
    .get("/api/employer/:employerId/employee/:employeeId", async ctx => await employeeController.get(ctx))
    .post("/api/employer/:employerId/employee", async ctx => await employeeController.post(ctx))

    // pay instruction
    .get("api/employer/:employerId/employee/:employeeId/payInstruction/new", async ctx => await payInstructionController.requestNewInstruction(ctx))
    .post("api/employer/:employerId/employee/:employeeId/payInstruction", async ctx => payInstructionController.addNewInstruction(ctx))
    .get("api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.getInstruction(ctx))
    .post("api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.saveInstruction(ctx))
    .delete("/api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.delete(ctx))

    // pay run
    .post("/api/employer/:employerId/payRun", async ctx => await payRunController.post(ctx))
    .get("/api/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId", async ctx => await payRunController.get(ctx))
    .delete("/api/employer/:employerId/paySchedule/:payScheduleId/payRun/:payRunId", async ctx => await payRunController.delete(ctx))

    // pay runs
    .get("/api/employer/:employerId/payRuns", async ctx => await payRunsController.get(ctx))

    // comentary
    .get("/api/employer/:employerId/employee/:employeeId/commentary/:commentaryId", async ctx => await commentaryController.getCommentary(ctx))

    // pay slip
    .get("/api/employer/:employerId/employee/:employeeId/paySlipData/:code/:taxPeriod/:taxYear", async ctx => await paySlipController.getPaySlipData(ctx))

    // rti transaction
    .get("/api/employer/:employerId/rtiTransaction/:rtiTransactionId", async ctx => await rtiController.get(ctx))    
    .post("/api/employer/:employerId/rtiTransaction", async ctx => await rtiController.post(ctx))

    // p45 pay instruction
    .post("api/employer/:employerId/Employee/:employeeId/P45Instruction", async ctx => await p45InstructionController.postNewInstruction(ctx))
    .post("api/employer/:employerId/Employee/:employeeId/P45Instruction/:id", async ctx => await p45InstructionController.postExistingInstruction(ctx))
;

module.exports = router.routes();