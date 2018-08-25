const path = require("path");

module.exports = (payInstructionType) => {
    let folder = path.join(__dirname, "../services/payInstructions");

    if (payInstructionType.toLowerCase().indexOf("ytd") !== -1) {
        folder = path.join(folder, "yearToDate");
    }

    let piFile = path.join(folder, payInstructionType);
    let pi = require(piFile);
    let instance = new pi();

    return instance.name;
};