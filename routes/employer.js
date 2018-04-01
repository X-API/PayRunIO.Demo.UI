const router = require("koa-router")();
const ApiWrapper = require("../services/api-wrapper");
const EmployerService = require("../services/employer-service");
const ValidationParser = require("../services/validation-parser");
const EmployerUtils = require("../services/employer-utils");
const StatusUtils = require("../services/status-utils");

const apiWrapper = new ApiWrapper();
const validationParser = new ValidationParser();
const employerService = new EmployerService();

router
    .get("/", async ctx => {
        let employers = await apiWrapper.getAndExtractLinks("Employers");

        await ctx.render("employers", {
            title: "Employers",
            employers: employers
        });
    })

    .post("/", async ctx => {
        let body = EmployerUtils.parse(ctx.request.body);
        let response = await apiWrapper.post("Employers", { Employer: body });

        if (validationParser.containsErrors(response)) {
            await ctx.render("employer", Object.assign(body, { 
                title: "Add a new Employer",
                errors: validationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: "Add a new Employer" }
                ]
            }));
            return;
        }

        await ctx.redirect(response.Link["@href"] + "?status=Employer details saved&statusType=success");
    })

    .get("/new", async ctx => {
        await ctx.render("employer", {
            title: "Add a new Employer",
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Add a new Employer" }
            ]
        });
    })

    .get("/:id", async ctx => {
        let id = ctx.params.id;
        let response = await apiWrapper.get(`Employer/${id}`);
        let employees = await apiWrapper.getAndExtractLinks(`Employer/${id}/Employees`);
        let paySchedules = await employerService.getPaySchedules(id);

        let body = Object.assign(response.Employer, {
            Id: id,
            ShowTabs: true,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: response.Employer.Name }
            ],
            Employees: employees,
            PaySchedules: paySchedules,
            title: response.Employer.Name,
            Status: StatusUtils.extract(ctx)
        });

        await ctx.render("employer", body);
    })

    .post("/:id", async ctx => {
        let id = ctx.params.id;
        let body = EmployerUtils.parse(ctx.request.body);
        let response = await apiWrapper.put(`Employer/${id}`, { Employer: body });

        if (validationParser.containsErrors(response)) {
            await ctx.render("employer", Object.assign(body, { 
                Id: id,
                errors: validationParser.extractErrors(response),
                Breadcrumbs: [
                    { Name: "Employers", Url: "/employer" },
                    { Name: body.Name }
                ]                
            }));
            return;
        }
        
        await ctx.redirect(`/employer/${id}?status=Employer details saved&statusType=success`); // todo: append success query string
    })

    .post("/:id/delete", async ctx => {
        
    });

module.exports = router;