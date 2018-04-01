const router = require("koa-router")();
const ApiWrapper = require("../services/api-wrapper");
const PayInstruction = require("./pay-instruction");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployeeUtils = require("../services/employee-utils");

const apiWrapper = new ApiWrapper();
const employerService = new EmployerService();
const validationParser = new ValidationParser();

router
    .get("/:employerId/employee/new", async ctx => {
        let employerId = ctx.params.employerId;
        let paySchedules = await employerService.getPaySchedules(employerId);

        await ctx.render("employee", {
            title: "Add a new Employee",
            EmployerId: employerId,
            PaySchedules: paySchedules,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Add a new Employee" }
            ]
        });        
    })

    .post("/:employerId/employee", async ctx => {
        let body = EmployeeUtils.parse(ctx.request.body);
        let employerId = ctx.params.employerId;
        let response = await apiWrapper.post(`Employer/${employerId}/Employees`, { Employee: body });

        if (validationParser.containsErrors(response)) {
            await ctx.render("employee", Object.assign(body, { 
                title: "Add a new Employee",
                EmployerId: employerId,
                errors: validationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Employer", Url: `/employer/${employerId}` },
                    { Name: "Add a new Employee" }
                ]
            }));
            return;
        }

        await ctx.redirect(response.Link["@href"] + "?status=Employee details saved&statusType=success");        
    })
    
    .get("/:employerId/employee/:employeeId", (ctx, next) => {
        
    })
    
    .post("/:employerId/employee/:employeeId", (ctx, next) => {
        
    })
    
    .post("/:employerId/employee/:employeeId/delete", (ctx, next) => {
        
    });

router.use("/", PayInstruction.routes());

module.exports = router;