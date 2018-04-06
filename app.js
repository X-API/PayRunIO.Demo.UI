const Koa = require("koa");
const Router = require("koa-router");
const Helmet = require("koa-helmet");
const Serve = require("koa-static");
const Compress = require("koa-compress");
const HandlebarsRenderer = require("koa-hbs-renderer");
const Handlebars = require("handlebars");
const BodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const RootController = require("./controllers/root-controller");
const EmployerController = require("./controllers/employer-controller");
const EmployeeController = require("./controllers/employee-controller");
const PayScheduleController = require("./controllers/pay-schedule-controller");
const PayInstructionController = require("./controllers/pay-instruction-controller");
const argv = require('minimist')(process.argv.slice(2));

let app = new Koa();
let router = new Router();
let port = process.env.PORT || (argv.p || 3000);

let rootController = new RootController();
let employerController = new EmployerController();
let employeeController = new EmployeeController();
let payScheduleController = new PayScheduleController();
let payInstructionController = new PayInstructionController();

// root/get started
router.get("/", async ctx => await rootController.getRootView(ctx));

// employer
router.get("/employer", async ctx => await employerController.getEmployers(ctx));
router.post("/employer", async ctx => await employerController.addNewEmployer(ctx));
router.get("/employer/new", async ctx => await employerController.requestNewEmployer(ctx));
router.get("/employer/:id", async ctx => await employerController.getEmployerDetails(ctx));
router.post("/employer/:id", async ctx => await employerController.saveEmployerDetails(ctx));
router.post("/employer/:id/delete", async ctx => { });

// pay schedule
router.get("/employer/:employerId/paySchedule/new", async ctx => await payScheduleController.requestNewSchedule(ctx));
router.post("/employer/:employerId/paySchedule", async ctx => await payScheduleController.addNewSchedule(ctx));
router.get("/employer/:employerId/paySchedule/:payScheduleId", async ctx => await payScheduleController.getScheduleDetails(ctx));
router.post("/employer/:employerId/paySchedule/:payScheduleId", async ctx => await payScheduleController.saveScheduleDetails(ctx));
router.post("/employer/:employerId/paySchedule/:payScheduleId/delete", async ctx => await payScheduleController.deleteSchedule(ctx));

// employee
router.get("/employer/:employerId/employee/new", async ctx => await employeeController.requestNewEmployee(ctx));
router.post("/employer/:employerId/employee", async ctx => await employeeController.addNewEmployee(ctx));
router.get("/employer/:employerId/employee/:employeeId", async ctx => await employeeController.getEmployeeDetails(ctx));
router.post("/employer/:employerId/employee/:employeeId", async ctx => await employeeController.saveEmployeeDetails(ctx));
router.get("/employer/:employerId/employee/:employeeId/leaver-details", async ctx => { });
router.get("/employer/:employerId/employee/:employeeId/p45", async ctx => { });
router.get("/employer/:employerId/employee/:employeeId/p60", async ctx => await employeeController.request60(ctx));
router.post("/employer/:employerId/employee/:employeeId/p60", async ctx => await employeeController.downloadP60(ctx));
router.post("/employer/:employerId/employee/:employeeId/delete", async ctx => { });

// pay instruction
router.get("/employer/:employerId/employee/:employeeId/payInstruction/new", async ctx => await payInstructionController.requestNewInstruction(ctx));
router.post("/employer/:employerId/employee/:employeeId/payInstruction", async ctx => payInstructionController.addNewInstruction(ctx));
router.get("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.getInstruction(ctx));
router.post("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => payInstructionController.saveInstruction(ctx));
router.post("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId/delete", async ctx => payInstructionController.deleteInstruction(ctx));

app
    .use(HandlebarsRenderer({
        cacheExpires: 0,
        defaultLayout: "main",
        environment: "development",
        hbs: Handlebars.create(),
        paths: {
            views: path.join(__dirname, "views"),
            layouts: path.join(__dirname, "views", "layouts"),
            helpers: path.join(__dirname, "helpers"),
            partials: path.join(__dirname, "views", "partials")
        }
    }))
    .use(Helmet())
    //.use(Compress())
    .use(BodyParser())
    .use(Serve("./content"))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, () => {
    console.log(`up and listing on port ${port}`)
});