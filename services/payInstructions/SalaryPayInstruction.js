const BaseInstruction = require("./BaseInstruction");
const moment = require("moment");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    async getMinStartDateForNewInstruction({ employerId, employeeId, payInstructionId }) {
        let payInstructions = await this.getInstructions(employerId, employeeId);
        let filteredPayInstructions = payInstructions.filter(pi => pi.EndDate && pi.Id !== payInstructionId);

        if (filteredPayInstructions.length === 0) {
            return null;
        }

        let orderedPayInstructions = filteredPayInstructions.sort((a, b) => new Date(b.EndDate) - new Date(a.EndDate));
        let endDate = moment(orderedPayInstructions[0].EndDate);

        return endDate.add(1, "day").format("YYYY-MM-DD");        
    }
};