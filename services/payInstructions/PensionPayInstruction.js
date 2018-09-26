const BaseInstruction = require("./BaseInstruction");
const ApiWrapper = require("../../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class PensionPayInstruction extends BaseInstruction {
    get name() {
        return "Pension";
    }

    get canInstructionsOverlap() {
        return true;
    }

    async extendViewModel(ctx, vm) {
        let extendedViewModel = await super.extendViewModel(vm);
        let pensions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${vm.EmployerId}/Pensions`);

        extendedViewModel.Pensions = pensions.map(pension => {
            return {
                Id: pension.Id,
                Name: `${pension.ProviderName} - ${pension.SchemeName}`
            };
        });

        return extendedViewModel;
    }

    parseForApi(body) {
        let employerId = body.EmployerId;
        let cleanBody = super.parseForApi(body);

        cleanBody.SalarySacrifice = (cleanBody.SalarySacrifice !== undefined && cleanBody.SalarySacrifice !== null && cleanBody.SalarySacrifice.toLowerCase() === "on");
        cleanBody.Pension = {
            "@href": `/Employer/${employerId}/Pension/${body.Pension}`
        };

        return cleanBody;
    }
};