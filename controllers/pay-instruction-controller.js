const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");
const ValidationParser = require("../services/validation-parser");
const MinStartDateQuery = require("../queries/employee-last-pay-date");

let apiWrapper = new ApiWrapper();

module.exports = class PayInstructionController extends BaseController {
    async requestNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let instructionType = ctx.query.type || (ctx.session.body ? ctx.session.body.InstructionType : undefined);
        let payScheduleKey = ctx.query.payScheduleKey;

        let queryStr = JSON.stringify(MinStartDateQuery)
            .replace("$$EmployerKey$$", employerId)
            .replace("$$EmployeeKey$$", employeeId)
            .replace("$$PayScheduleKey$$", payScheduleKey);

        let query = JSON.parse(queryStr);
        let queryResult = await apiWrapper.query(ctx, query);

        let lastPayDay = new Date(queryResult.MinStartQuery.LastPayDay);
        let minInstructionStartDate = new Date(lastPayDay.getFullYear(),lastPayDay.getMonth(),lastPayDay.getDate()+1); 
        let defaultStartDate = queryResult.MinStartQuery.NextPeriodStart;

        if (!instructionType) {
            await ctx.redirect(`/employer/${employerId}/employee/${employeeId}#instructions`);
            return;
        }

        let body = {
            title: "Pay instruction",
            EmployeeId: employeeId,
            EmployerId: employerId,
            InstructionType: instructionType,
            EnableForm: true,
            MinStartDate: minInstructionStartDate,
            StartDate: defaultStartDate,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Pay instruction" }
            ],
            layout: "modal"
        };

        if (ctx.query && ctx.query.type) {
            body.InstructionType = ctx.query.type;
        }

        let instructionTypeInstance = this.getInstructionInstance(instructionType);
        let extendedViewModel = await this.getExtendedViewModel(ctx, body);
        let instructionTypeExtendedViewModel = await instructionTypeInstance.extendViewModel(ctx, extendedViewModel);

        await ctx.render("pay-instruction", instructionTypeExtendedViewModel);
    }

    async addNewInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstructions`;
        let body = ctx.request.body;
        let instructionType = body.InstructionType;
        let cleanBody = this.getInstructionInstance(instructionType).parseForApi(body);
        let request = {};

        request[instructionType] = cleanBody;

        console.log(cleanBody);

        let response = await apiWrapper.post(ctx, apiRoute, request);

        if (ctx.headers["x-requested-with"] === "XMLHttpRequest") {
            ctx.body = {
                Errors: ValidationParser.extractErrors(response)
            };
            return;
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);

            ctx.redirect("/payInstruction/new");
            return;
        }

        await this.redirectWithStatus(ctx, employerId, employeeId, instructionType);
    }

    async getInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;

        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;

        let response = await apiWrapper.get(ctx, apiRoute);
        let instructionType = Object.keys(response)[0];

        let body = Object.assign(response[instructionType], {
            title: "Pay instruction",
            Id: id,
            EnableForm: true,
            EmployeeId: employeeId,
            EmployerId: employerId,
            InstructionType: instructionType,
            MinStartDate: null,
            Breadcrumbs: [
                { Name: "Employers", Url: "/employer" },
                { Name: "Employer", Url: `/employer/${employerId}` },
                { Name: "Employee", Url: `/employer/${employerId}/employee/${employeeId}#instructions` },
                { Name: "Pay instruction" }
            ],
            layout: "modal"
        });

        let instructionTypeInstance = this.getInstructionInstance(instructionType);
        let extendedViewModel = await this.getExtendedViewModel(ctx, body);
        let instructionTypeExtendedViewModel = await instructionTypeInstance.extendViewModel(ctx, extendedViewModel);        

        await ctx.render("pay-instruction", instructionTypeExtendedViewModel);
    }

    async saveInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let id = ctx.params.payInstructionId;
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${id}`;
        let body = ctx.request.body;
        let instructionType = body.InstructionType;
        let cleanBody = this.getInstructionInstance(instructionType).parseForApi(body);
        let request = {};

        request[instructionType] = cleanBody;

        let response = await apiWrapper.put(ctx, apiRoute, request);

        if (ctx.headers["x-requested-with"] === "XMLHttpRequest") {
            ctx.body = {
                Errors: ValidationParser.extractErrors(response)
            };
            return;
        }

        if (ValidationParser.containsErrors(response)) {
            ctx.session.body = body;
            ctx.session.errors = ValidationParser.extractErrors(response);
            
            ctx.redirect(apiRoute);
            return;
        }

        await this.redirectWithStatus(ctx, employerId, employeeId, instructionType);
    }

    async deleteInstruction(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let payInstructionId = ctx.params.payInstructionId;
        
        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/PayInstruction/${payInstructionId}`;

        let response = await apiWrapper.delete(ctx, apiRoute);

        if (ValidationParser.containsErrors(response)) {
            ctx.body = {
                errors: ValidationParser.extractErrors(response)
            };
        }
        else {
            ctx.body = {};
        }
    }

    async redirectWithStatus(ctx, employerId, employeeId, instructionType) {
        let employeeRoute = `/employer/${employerId}/employee/${employeeId}`;
        let hash = instructionType.toLowerCase().indexOf("ytd") !== -1 ? "#year-to-date-instructions" : "#instructions";
        
        await ctx.redirect(`${employeeRoute}?status=Pay instruction saved&statusType=success${hash}`);        
    }

    async canInstructionBeAdded({ employerId, employeeId, type }) {
        let instruction = this.getInstructionInstance(type);

        return instruction.canNewInstructionBeAdded(employerId, employeeId);
    }

    async getMinStartDateForNewInstruction({ ctx, employerId, employeeId, payInstructionId, type }) {
        let instruction = this.getInstructionInstance(type);

        return instruction.getMinStartDateForNewInstruction({
            ctx: ctx,
            employerId: employerId,
            employeeId: employeeId,
            payInstructionId: payInstructionId
        });
    }

    getInstructionInstance(type) {
        let Instruction;

        if (type.toLowerCase().indexOf("ytd") !== -1) {
            Instruction = require(`../services/payInstructions/yearToDate/${type}`);
        }
        else {
            Instruction = require(`../services/payInstructions/${type}`);
        }

        return new Instruction();        
    }
};