const ApiWrapper = require("../api-wrapper");
const moment = require("moment");

let apiWrapper = new ApiWrapper();

module.exports = class BaseInstruction {
    get canInstructionsOverlap() {
        // This property has to be implemented for each new instruction.
    }

    parseForApi(body) {
        let copy = JSON.parse(JSON.stringify(body));

        // clear out utility properties as otherwise the api will return an error as they are unexpected.
        copy.MinStartDate = null;
        copy.InstructionType = null;

        return copy;
    }

    async canNewInstructionBeAdded(employerId, employeeId) {
        if (this.canInstructionsOverlap) {
            return true;
        }

        let payInstructions = await this.getInstructions(employerId, employeeId);

        return !payInstructions.includes(pi => !pi.EndDate);
    }

    async getMinStartDateForNewInstruction({ employerId, employeeId, payInstructionId }) {
        if (this.canInstructionsOverlap) {
            return null;
        }

        let payInstructions = await this.getInstructions(employerId, employeeId);
        let filteredPayInstructions = payInstructions.filter(pi => pi.EndDate && pi.Id !== payInstructionId);

        if (filteredPayInstructions.length === 0) {
            return null;
        }

        let orderedPayInstructions = filteredPayInstructions.sort((a, b) => new Date(b.EndDate) - new Date(a.EndDate));
        let endDate = moment(orderedPayInstructions[0].EndDate);

        return endDate.add(1, "day").format("YYYY-MM-DD");        
    }

    async getInstructions(employerId, employeeId) {
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let instructionType = this.constructor.name;
        let links = await apiWrapper.getLinks(apiRoute);
        
        let filteredLinks = links.filter(link => {
            return link["@rel"] === instructionType;
        });

        return await apiWrapper.extractLinks(filteredLinks);
    }
};