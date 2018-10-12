const BaseController = require("./base-controller");
const path = require("path");
const fs = require("fs");

module.exports = class PayInstructionsController extends BaseController {
    async get(ctx) {
        let normalFolder = path.join(__dirname, "../services/pay-instructions/normal");
        let ytdFolder = path.join(__dirname, "../services/pay-instructions/year-to-date");

        let normalPayInstructions = this.getInstructions(normalFolder, "normal");
        let ytdPayInstructions = this.getInstructions(ytdFolder, "year-to-date");

        let allPayInstructions = normalPayInstructions.concat(ytdPayInstructions);

        ctx.body = allPayInstructions;
    }

    getInstructions(folder, group) {
        let excludedFiles = [
            "base-absence-pay-instruction", 
            "base-absence-ytd-pay-instruction", 
            "base-ytd-pay-instruction"
        ];
        
        let files = fs.readdirSync(folder);

        return files.map(file => {
            return file.replace(".js", "");
        }).filter(formattedFilename => {
            return excludedFiles.indexOf(formattedFilename) === -1;
        }).map(formattedFilename => {
            let instruction = require(path.join(folder, formattedFilename));
            let instance = new instruction();

            return {
                name: instance.name,
                type: formattedFilename,
                group: group
            };
        });
    }
};