const router = require("koa-router")();
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

const apiWrapper = new ApiWrapper();
const validationParser = new ValidationParser();

router
    .get("/", async (ctx, next) => {
        let employers = await apiWrapper.getAndExtractLinks("Employers");

        ctx.render("employers", {
            employers: employers
        });
    })
    .post("/", async (ctx, next) => {
        let body = ctx.request.body; // todo: need to parse this and build up an employer object. 
        let response = await apiWrapper.post("Employers", body);

        if (validationParser.containsErrors(response)) {
            ctx.render("employer/employer", Object.assign(body, validationParser.extractErrors(response)));
            return;
        }

        ctx.redirect(response.Link["@href"]);
    })
    .get("/new", async (ctx, next) => {
        ctx.render("employer", {});
    })    
    .get("/:id", async (ctx, next) => {
        let id = ctx.params.id;
        let response = await apiWrapper.get(`Employer/${id}`);
        let employees = await apiWrapper.get(`Employer/${id}/Employees`);



        ctx.render("employer/employer", response.Employer);
    })
    .post("/:id", (next) => {
        
    })
    .post("/:id/delete", (next) => {
        
    });

module.exports = router;