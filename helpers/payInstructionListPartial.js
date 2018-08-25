const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

module.exports = (ctx, parentCtx) => {
    if (ctx) {
        let type = ctx.InstructionType;
        let folder = path.join(__dirname, "../views/partials/payInstructions/lists");

        if (type.toLowerCase().indexOf("ytd") !== -1) {
            folder = path.join(folder, "yearToDate");
        }

        let partial = path.join(folder, `${type}.hbs`);
        let hbs = fs.readFileSync(partial, { encoding: "utf8" });
        let compiledHbs = Handlebars.compile(hbs);

        ctx.ParentContext = parentCtx;

        return new Handlebars.SafeString(compiledHbs(ctx));
    }

    return "";
};