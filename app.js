const Koa = require("koa");
const Router = require("koa-router");
const Helmet = require("koa-helmet");
const Serve = require("koa-static");
const Compress = require("koa-compress");
const Handlebars = require("koa-hbs-renderer");
const fs = require("fs");
const path = require("path");

let app = new Koa();
let router = new Router();

fs.readdirSync(path.join(__dirname, `routes`)).forEach((file) => {
    if (file.substr(-3) === `.js`) {
        let instance = require(`./routes/${file}`);
        let route = file.toLowerCase().replace(`.js`, ``)

        router.use(`/${route}`, instance.routes());
    }
});

router.get("/", async (ctx, next) => {
    await ctx.render("index", { title: "Get started" });
});

app
    .use(Handlebars({
        defaultLayout: "main",
        environment: "development",
        paths: {
            views: path.join(__dirname, "views"),
            layouts: path.join(__dirname, "layouts")
        }
    }))
    .use(Helmet())
    .use(Compress())
    .use(Serve("./content"))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);