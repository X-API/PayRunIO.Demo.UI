const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const EmployeeUtils = require("../services/employee-utils");
const _ = require("lodash");

let apiWrapper = new ApiWrapper();

module.exports = class EmployeeController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}`;
        let response = await apiWrapper.get(apiRoute);
        let payInstructions = await apiWrapper.getAndExtractLinks(`/Employer/${employerId}/Employee/${employeeId}/PayInstructions`);

        let filteredPayInstructions = payInstructions.filter(pi => {
            return pi.ObjectType !== "P45PayInstruction";
        });

        let canAddANewPayInstruction = filteredPayInstructions.filter(pi => pi.EndDate).length === filteredPayInstructions.length;
        let employee = EmployeeUtils.parseFromApi(response.Employee);

        ctx.body = Object.assign(employee, {
            Id: employeeId,
            PayInstructions: filteredPayInstructions,
            GroupedPayInstructions: this.getNormalGroupedPayInstructions(filteredPayInstructions),
            GroupedYTDPayInstructions: this.getYTDGroupedPayInstructions(filteredPayInstructions),
            CanAddANewPayInstruction: filteredPayInstructions.length === 0 || canAddANewPayInstruction,
            P45PayInstruction: this.getP45PayInstruction(payInstructions)
        });
    }

    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let response = null;

        if (body.Id) {
            let url = `Employer/${employerId}/Employee/${body.Id}`;

            response = await apiWrapper.put(url, { Employee: EmployeeUtils.parse(body, employerId) });
        }
        else {
            let url = `Employer/${employerId}/Employees`;

            response = await apiWrapper.post(url, { Employee: EmployeeUtils.parse(body, employerId) });
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                employeeId: 0,
                status: {
                    message: "Employee details saved",
                    type: "success"
                }
            };
        }
    }

    getP45PayInstruction(instructions) {
        let p45Instruction = instructions.find(pi => {
            return pi.ObjectType === "P45PayInstruction";
        });

        return p45Instruction;
    }

    getNormalGroupedPayInstructions(instructions) {
        let filtered = instructions.filter(i => i.ObjectType.toLowerCase().indexOf("ytd") === -1);
        let grouped = this.getGroupedPayInstructions(filtered);

        return this.getProjectedPayInstructions(grouped);
    }

    getYTDGroupedPayInstructions(instructions) {
        let filtered = instructions.filter(i => i.ObjectType.toLowerCase().indexOf("ytd") !== -1);
        let grouped = this.getGroupedPayInstructions(filtered);

        return this.getProjectedPayInstructions(grouped);
    }

    getGroupedPayInstructions(instructions) {
        let groupedPayInstructions = _.groupBy(instructions, (pi) => {
            return pi.ObjectType;
        });

        return groupedPayInstructions;
    }

    getProjectedPayInstructions(groupedPayInstructions) {
        let projectedPayInstructions = Object.keys(groupedPayInstructions).map(key => {
            let instructions = groupedPayInstructions[key];
    
            return {
                InstructionType: key,
                Instructions: instructions
            };
        });
        
        return projectedPayInstructions;
    }
};