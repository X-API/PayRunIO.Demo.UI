const BaseInstruction = require("../base-instruction");

module.exports = class BaseYtdPayInstruction extends BaseInstruction {
    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (!cleanBody.IsAdjustment) {
            cleanBody.IsAdjustment = false;
        }
        
        return cleanBody;
    }    
};