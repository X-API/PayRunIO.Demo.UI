const Koa = require("koa");
const Router = require("koa-router");
const Helmet = require("koa-helmet");
const Serve = require("koa-static");
const Mount = require("koa-mount");
const HandlebarsRenderer = require("koa-hbs-renderer");
const Handlebars = require("handlebars");
const BodyParser = require("koa-bodyparser");
const Session = require("koa-session");
const MemoryStore = require("koa-session-memory");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));
const Routes = require("./api/routes");
const Raven = require("raven");
const APILogger = require("./api/services/api-logger");

let app = new Koa();
let router = new Router();
let port = process.env.PORT || (argv.p || 3000);
let store = new MemoryStore();
let env = process.env.NODE_ENV || "dev";

router.use(Routes);

app.keys = [
    "E3E924616A17C74B6C86A4E8A8247",
    "1B3BFBC23C5E8B15B49F4E7215C7C",
    "D26844674494D37AF7C2D88543796",
    "3B5B972B49C1D8EA84BD4FF74F3CD"
];

if (env !== "dev") {
    Raven.config("https://7059d23c62044480981159a1d386f7d0@sentry.io/1187976").install();
}

app
    .use(Session({
        store,
        key: "koa:sess",
        maxAge: 86400000      
    }, app))
    .use(async (ctx, next) => {
        if (ctx.path !== "/favicon.ico") {
            APILogger.context = ctx;
        }

        await next();
    })
    // .use(async (ctx, next) => {
    //     let setupCookie = ctx.cookies.get(SetupController.cookieKey);
    //     await next();
    // })
    .use(async (ctx, next) => {
        try {
            await next();
        
            if (ctx.status === 404) {
                await ctx.render("errors/404");
            }
        } 
        catch (err) {
            console.error(err); // eslint-disable-line no-console

            Raven.captureException(err);

            await ctx.render("errors/500", {
                message: err.message,
                stack: err.stack.split("\n").join("<br>").trim()
            });      
        }
    })
    .use(HandlebarsRenderer({
        cacheExpires: 0,
        defaultLayout: "main",
        environment: "development",
        hbs: Handlebars,
        paths: {
            views: path.join(__dirname, "views"),
            //layouts: path.join(__dirname, "views", "layouts"),
            //helpers: path.join(__dirname, "helpers"),
            //partials: path.join(__dirname, "views", "partials")
        }
    }))
    .use(Helmet())
    .use(BodyParser())
    .use(Mount("/content", Serve("./content")))
    //.use(Serve("./content"))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, () => {
    console.log(`up and listing on port ${port}`); // eslint-disable-line no-console
});