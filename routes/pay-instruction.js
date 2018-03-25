const router = require("koa-router")();

router
    .get("/:employerId/employee/:employeeId/payInstruction/new", (ctx, next) => {
        
    })
    .post("/:employerId/employee/:employeeId/payInstruction", (ctx, next) => {
        
    })    
    .get("/:employerId/employee/:employeeId/payInstruction/:payInstructionId", (ctx, next) => {
        
    })
    .post("/:employerId/employee/:employeeId/payInstruction/:payInstructionId", (ctx, next) => {
        
    })
    .post("/:employerId/employee/:employeeId/payInstruction/:payInstructionId/delete", (ctx, next) => {
        
    });

module.exports = router;