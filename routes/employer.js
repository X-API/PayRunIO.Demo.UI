const router = require("koa-router")();
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");

const apiWrapper = new ApiWrapper();
const validationParser = new ValidationParser();

router
    .get("/", async (ctx, next) => {
        let employers = await apiWrapper.getAndExtractLinks("Employers");

        ctx.render("employers", {
            title: "Employers",
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
        let employees = await apiWrapper.getAndExtractLinks(`Employer/${id}/Employees`);
        let paySchedules = await apiWrapper.getAndExtractLinks(`Employer/${id}/PaySchedules`);

        let body = Object.assign(response.Employer, {
            ShowTabs: true,
            Employees: employees,
            PaySchedules: paySchedules
        });

        ctx.render("employer", body);
    })
    .post("/:id", (next) => {
        
    })
    .post("/:id/delete", (next) => {
        
    });

module.exports = router;