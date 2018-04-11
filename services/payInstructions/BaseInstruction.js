const ApiWrapper = require("../api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class BaseInstruction {
    async getMinStartDateForNewInstruction({ employerId, employeeId, payInstructionId }) {
        // This method has to be implemented for each new instruction. If that instruction allows 
        // for overlapping then `return null`. Don't call base.getMinStartDateForNewInstruction() 
        // to prevent the pay instruction from erroring.

        throw new Error("Oh noes! You forgot to implement getMinStartDateForNewInstruction");
    }

    async getInstructions(employerId, employeeId) {
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        
        // todo: going to have to filter out by type at this point using this.constructor.name. 
        return await apiWrapper.getAndExtractLinks(apiRoute);
    }
};