const BaseYtdPayInstruction = require("./base-ytd-pay-instruction");
const ApiWrapper = require("../../../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class PensionYtdPayInstruction extends BaseYtdPayInstruction {
    get name() {
        return "Pension YTD";
    }

    async extendViewModel(ctx, vm) {
        let evm = await super.extendViewModel(ctx, vm);
        let pensions = await apiWrapper.getAndExtractLinks(ctx, `Employer/${vm.EmployerId}/Pensions`);
        let selectedPensionId = "";

        if (evm.Pension) {
            let idParts = evm.Pension["@href"].split("/");

            selectedPensionId = idParts[idParts.length - 1];
        }

        evm.Pensions = pensions.map(pension => {
            return {
                Id: pension.Id,
                Name: `${pension.ProviderName} - ${pension.SchemeName}`,
                Selected: pension.Id === selectedPensionId
            };
        });

        return evm;
    }

    parseForApi(body) {
        let employerId = body.EmployerId;
        let cleanBody = super.parseForApi(body);

        return { 
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            PensionablePay: cleanBody.PensionablePay,
            Value: cleanBody.Value,
            EmployerContribution: cleanBody.EmployerContribution,
            Code: cleanBody.Code,
            Description: cleanBody.Description,
            MinStartDate: cleanBody.MinStartDate,
            InstructionType: cleanBody.InstructionType,
            EmployerId: cleanBody.EmployerId,
            IsAdjustment: cleanBody.IsAdjustment,
            Pension: {
                "@href": `/Employer/${employerId}/Pension/${body.Pension}`
            }            
        };
    }
};