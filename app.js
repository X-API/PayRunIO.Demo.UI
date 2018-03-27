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
const Employer = require("./routes/employer");

let app = new Koa();
let router = new Router();

router.get("/", async (ctx, next) => {
    await ctx.render("index", { title: "Get started" });
});

router.use("/employer", Employer.routes());

app
    .use(HandlebarsRenderer({
        cacheExpires: 0,
        defaultLayout: "main",
        environment: "development",
        hbs: Handlebars.create(),
        paths: {
            views: path.join(__dirname, "views"),
            layouts: path.join(__dirname, "layouts"),
            helpers: path.join(__dirname, "helpers"),
            partials: path.join(__dirname, "partials")
        }
    }))
    .use(Helmet())
    //.use(Compress())
    .use(BodyParser())
    .use(Serve("./content"))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);