const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

module.exports = (ctx) => {
    if (ctx) {
        let type = ctx.InstructionType;
        let partial = path.join(__dirname, "..", "views", "partials", "payInstructions", "forms", `${type}.hbs`);
        let hbs = fs.readFileSync(partial, { encoding: "utf8" });
        let compiledHbs = Handlebars.compile(hbs);

        return new Handlebars.SafeString(compiledHbs(ctx));
    }

    return "";
};