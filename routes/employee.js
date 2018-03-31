const router = require("koa-router")();
const PayInstruction = require("./pay-instruction");

router
    .get("/:employerId/employee/new", async ctx => {
        let employerId = ctx.params.employerId;

        await ctx.render("employee", {
            title: "Add a new Employee",
            EmployerId: employerId,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Add a new Employee" }
            ]
        });        
    })

    .post("/:employerId/employee", (ctx, next) => {
        
    })    
    
    .get("/:employerId/employee/:employeeId", (ctx, next) => {
        
    })
    
    .post("/:employerId/employee/:employeeId", (ctx, next) => {
        
    })
    
    .post("/:employerId/employee/:employeeId/delete", (ctx, next) => {
        
    });

router.use("/", PayInstruction.routes());

module.exports = router;