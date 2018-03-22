const router = require("koa-router")();
const ApiWrapper = require("../services/api-wrapper");

const apiWrapper = new ApiWrapper();

router
    .get("/", async (next) => {
        let response = await apiWrapper.get("Employers");

        console.log(response);
    })
    .post("/", (next) => {

    })
    .get("/:id", (next) => {
        
    })
    .post("/:id", (next) => {
        
    })
    .post("/:id/delete", (next) => {
        
    });

module.exports = router;