const router = require("koa-router")();
const PayInstruction = require("./pay-instruction");

router
    .get("/:employerId/employee/new", (ctx, next) => {
        
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