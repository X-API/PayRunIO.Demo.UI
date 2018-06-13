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

    async extendViewModel(vm) {
        let extendedViewModel = await super.extendViewModel(vm);
        let pensions = await apiWrapper.getAndExtractLinks(`Employer/${vm.EmployerId}/Pensions`);

        extendedViewModel.Pensions = pensions.map(pension => {
            return {
                Id: pension.Id,
                Name: `${pension.ProviderName} - ${pension.SchemeName}`
            };
        });

        return extendedViewModel;
    }
};