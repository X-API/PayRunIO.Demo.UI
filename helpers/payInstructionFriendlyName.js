const path = require("path");

module.exports = (payInstructionType, options) => {
    let piFile = path.join(__dirname, "..", "services", "payInstructions", payInstructionType);
    let pi = require(piFile);
    let instance = new pi();

    return instance.name;
};