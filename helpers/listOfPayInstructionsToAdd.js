const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");

module.exports = (ctx, ytd) => {
    const excludedFiles = [
        "AbsencePayInstruction.js",
        "BaseInstruction.js",
        "BaseYtdPayInstruction.js",
        "BaseAbsenceYtdPayInstruction.js",
        "yearToDate"
    ];
    
    let folder = path.join(__dirname, "..", "services", "payInstructions");

    if (ytd) {
        folder = path.join(folder, "yearToDate");
    }

    let cssClass = "dropdown-item launch-modal";

    let html = fs.readdirSync(folder).map(file => {
        if (excludedFiles.includes(file)) {
            return "";
        }

        let pi = require(path.join(folder, file));
        let instance = new pi();
        let name = instance.name;
        let type = file.replace(".js", "");

        return `<a class="${cssClass}" data-modal-size="modal-lg" data-modal-title="${name}" href="/employer/${ctx.EmployerId}/employee/${ctx.Id}/payInstruction/new?type=${type}&payScheduleKey=${ctx.PaySchedule}">${name}</a>`;
    }).join("");

    return new Handlebars.SafeString(html);
};