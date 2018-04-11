const Koa = require("koa");
const Router = require("koa-router");
const Helmet = require("koa-helmet");
const Serve = require("koa-static");
const Compress = require("koa-compress");
const HandlebarsRenderer = require("koa-hbs-renderer");
const Handlebars = require("handlebars");
const BodyParser = require("koa-bodyparser");
const Session = require("koa-session");
const path = require("path");
const argv = require('minimist')(process.argv.slice(2));
const Routes = require("./routes");

let app = new Koa();
let router = new Router();
let port = process.env.PORT || (argv.p || 3000);

router.use(Routes);

app.keys = [
    "E3E924616A17C74B6C86A4E8A8247",
    "1B3BFBC23C5E8B15B49F4E7215C7C",
    "D26844674494D37AF7C2D88543796",
    "3B5B972B49C1D8EA84BD4FF74F3CD"
];

app
    .use(HandlebarsRenderer({
        cacheExpires: 0,
        defaultLayout: "main",
        environment: "development",
        hbs: Handlebars,
        paths: {
            views: path.join(__dirname, "views"),
            layouts: path.join(__dirname, "views", "layouts"),
            helpers: path.join(__dirname, "helpers"),
            partials: path.join(__dirname, "views", "partials")
        }
    }))
    .use(Helmet())
    .use(Compress())
    .use(BodyParser())
    .use(Serve("./content"))
    .use(Session(app))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, () => {
    console.log(`up and listing on port ${port}`)
});