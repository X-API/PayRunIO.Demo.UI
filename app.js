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
const argv = require('minimist')(process.argv.slice(2));

let app = new Koa();
let router = new Router();
let port = process.env.PORT || (argv.p || 3000);

let rootController = new RootController();
let employerController = new EmployerController();
let employeeController = new EmployeeController();
let payScheduleController = new PayScheduleController();

router.get("/", rootController.getRootView);

// employer
router.get("/employer", employerController.getEmployers);
router.post("/employer", employerController.addNewEmployer);
router.get("/employer/new", employerController.requestNewEmployer);
router.get("/employer/:id", employerController.getEmployerDetails);
router.post("/employer/:id", employerController.saveEmployerDetails);
router.post("/employer/:id/delete", async ctx => { });

// pay schedule
router.get("/employer/:employerId/paySchedule/new", payScheduleController.requestNewSchedule);
router.post("/employer/:employerId/paySchedule", payScheduleController.addNewSchedule);
router.get("/employer/:employerId/paySchedule/:payScheduleId", payScheduleController.getScheduleDetails);
router.post("/employer/:employerId/paySchedule/:payScheduleId", payScheduleController.saveScheduleDetails);
router.post("/employer/:employerId/paySchedule/:payScheduleId/delete", payScheduleController.deleteSchedule);

// employee
router.get("/employer/:employerId/employee/new", employeeController.requestNewEmployee);
router.post("/employer/:employerId/employee", employeeController.addNewEmployee);
router.get("/employer/:employerId/employee/:employeeId", employeeController.getEmployeeDetails);
router.post("/employer/:employerId/employee/:employeeId", async ctx => { })
router.get("/employer/:employerId/employee/:employeeId/leaver-details", async ctx => { })
router.get("/employer/:employerId/employee/:employeeId/p45", async ctx => { })
router.get("/employer/:employerId/employee/:employeeId/p60", employeeController.request60);
router.post("/employer/:employerId/employee/:employeeId/p60", employeeController.downloadP60);
router.post("/employer/:employerId/employee/:employeeId/delete", async ctx => { });

// pay instruction
router.get("/employer/:employerId/employee/:employeeId/payInstruction/new", async ctx => { });
router.post("/employer/:employerId/employee/:employeeId/payInstruction", async ctx => { });
router.get("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => { });
router.post("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId", async ctx => { });
router.post("/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId/delete", async ctx => { });;

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