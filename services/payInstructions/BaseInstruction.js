const ApiWrapper = require("../api-wrapper");
const moment = require("moment");
const PayInstructionType = require("../../models/PayInstructionType");

let apiWrapper = new ApiWrapper();

module.exports = class BaseInstruction {
    get type() {
        return PayInstructionType.normal;
    }

    get name() {
        throw Error("get name() needs implementing against each instruction");
    }

    get canInstructionsOverlap() {
        // This property has to be implemented for each new instruction.
        return true;
    }

    async extendViewModel(ctx, vm) {
        // override this to extend the passed in view model with instruction type specific properties. 
        return vm;
    }

    parseForApi(body) {
        let copy = JSON.parse(JSON.stringify(body));

        // clear out utility properties as otherwise the api will return an error as they are unexpected.
        copy.MinStartDate = null;
        copy.InstructionType = null;
        copy.EmployerId = null;

        // reorder properties so we always have the StartDate, EndDate and Description at the beginning of the 
        // list, as required by the api. 
        return Object.assign({
            StartDate: copy.StartDate,
            EndDate: copy.EndDate,
            Description: copy.Description
        }, copy);
    }

    async canNewInstructionBeAdded(employerId, employeeId) {
        if (this.canInstructionsOverlap) {
            return true;
        }

        let payInstructions = await this.getInstructions(employerId, employeeId);

        return !payInstructions.includes(pi => !pi.EndDate);
    }

    async getMinStartDateForNewInstruction({ ctx, employerId, employeeId, payInstructionId }) {
        if (this.canInstructionsOverlap) {
            return null;
        }

        let payInstructions = await this.getInstructions(ctx, employerId, employeeId);
        let filteredPayInstructions = payInstructions.filter(pi => pi.EndDate && pi.Id !== payInstructionId);

        if (filteredPayInstructions.length === 0) {
            return null;
        }

        let orderedPayInstructions = filteredPayInstructions.sort((a, b) => new Date(b.EndDate) - new Date(a.EndDate));
        let endDate = moment(orderedPayInstructions[0].EndDate);

        return endDate.add(1, "day").format("YYYY-MM-DD");        
    }

    async getInstructions(ctx, employerId, employeeId) {
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let instructionType = this.constructor.name;
        let links = await apiWrapper.getLinks(ctx, apiRoute);
        
        let filteredLinks = links.filter(link => {
            return link["@rel"] === instructionType;
        });

        return await apiWrapper.extractLinks(filteredLinks);
    }
};