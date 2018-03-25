const Koa = require("koa");
const Router = require("koa-router");
const Helmet = require("koa-helmet");
const Serve = require("koa-static");
const Compress = require("koa-compress");
const Handlebars = require("koa-hbs-renderer");
const BodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const Employer = require("./routes/employer");

let app = new Koa();
let router = new Router();

router.get("/", async (ctx, next) => {
    await ctx.render("index", { title: "Get started" });
});

router.use("/employer", Employer.routes());

app
    .use(Handlebars({
        defaultLayout: "main",
        environment: "development",
        paths: {
            views: path.join(__dirname, "views"),
            layouts: path.join(__dirname, "layouts"),
            helpers:  path.join(__dirname, "helpers")
        }
    }))
    .use(Helmet())
    .use(Compress())
    .use(BodyParser())
    .use(Serve("./content"))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);