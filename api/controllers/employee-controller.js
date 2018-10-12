const _ = require("lodash");
const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const EmployeeUtils = require("../services/employee-utils");
const EmployeeRevisionsQuery = require("../queries/employee-revisions-query");

let apiWrapper = new ApiWrapper();

module.exports = class EmployeeController extends BaseController {
    async get(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}`;
        let response = await apiWrapper.get(ctx, apiRoute);
        let payInstructions = await apiWrapper.getAndExtractLinks(ctx, `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`);

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
            P45PayInstruction: this.getP45PayInstruction(payInstructions),
            Revisions: await this.getRevisions(ctx, employerId, employeeId)
        });
    }

    async delete(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}`;
        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Employee deleted",
                    type: "success"
                }
            };
        }        
    }

    async post(ctx) {
        let employerId = ctx.params.employerId;
        let body = ctx.request.body;
        let response = null;

        if (body.Id) {
            let url = `Employer/${employerId}/Employee/${body.Id}`;

            response = await apiWrapper.put(ctx, url, { Employee: EmployeeUtils.parse(body, employerId) });

            if (ValidationParser.containsErrors(response)) {
                ctx.body = {
                    errors: ValidationParser.extractErrors(response)
                };
            }
            else {
                ctx.body = {
                    employeeId: body.Id,
                    status: {
                        message: "Employee details saved",
                        type: "success"
                    }
                };
            }            
        }
        else {
            let url = `Employer/${employerId}/Employees`;

            response = await apiWrapper.post(ctx, url, { Employee: EmployeeUtils.parse(body, employerId) });

            if (ValidationParser.containsErrors(response)) {
                ctx.body = {
                    errors: ValidationParser.extractErrors(response)
                };
            }
            else {
                let id = response.Link["@href"].split("/").slice(-1)[0];

                ctx.body = {
                    employeeId: id,
                    status: {
                        message: "Employee details saved",
                        type: "success"
                    }
                };
            }
        }
    }

    async deleteRevision(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let effectiveDate = ctx.params.effectiveDate;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/${effectiveDate}`;
        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {
                status: {
                    message: "Revision deleted",
                    type: "success"
                }
            };
        }
    }    

    async getRevisions(ctx, employerId, employeeId) {
        let queryStr = JSON.stringify(EmployeeRevisionsQuery)
            .replace("$$EmployerKey$$", employerId)
            .replace("$$EmployeeKey$$", employeeId);

        let query = JSON.parse(queryStr);
        
        let revisions = await apiWrapper.query(ctx, query);
        
        return Array.from(revisions.EmployeeRevisions.Revisions.Revision);
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
            let pi;
            
            if (key.trim().toLowerCase().indexOf("ytd") !== -1) {
                pi = require(`../services/pay-instructions/year-to-date/${key}`);
            }
            else {
                pi = require(`../services/pay-instructions/normal/${key}`);
            }

            let instance = new pi();
            let name = instance.name;

            return {
                InstructionType: key,
                InstructionFriendlyName: name,
                Instructions: instructions
            };
        });
        
        return projectedPayInstructions;
    }
};