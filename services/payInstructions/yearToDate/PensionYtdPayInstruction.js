const BaseYtdPayInstruction = require("./BaseYtdPayInstruction");
const ApiWrapper = require("../../../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class PensionYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Pension YTD";
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

    parseForApi(body) {
        let employerId = body.EmployerId;
        let cleanBody = super.parseForApi(body);

        cleanBody.Pension = {
            "@href": `/Employer/${employerId}/Pension/${body.Pension}`
        };

        return cleanBody;
    }    
};