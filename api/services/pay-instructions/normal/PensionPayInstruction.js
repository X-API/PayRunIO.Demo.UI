const BaseInstruction = require("../base-instruction");
const ApiWrapper = require("../../api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class PensionPayInstruction extends BaseInstruction {
    get name() {
        return "Pension";
    }

    async extendViewModel(ctx, vm) {
        let extendedViewModel = await super.extendViewModel(ctx, vm);
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