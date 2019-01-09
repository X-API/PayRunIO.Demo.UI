const BaseInstruction = require("./BaseInstruction");
const ApiWrapper = require("../../services/api-wrapper");
let apiWrapper = new ApiWrapper();

module.exports = class HolidaySchemePayInstruction extends BaseInstruction {
    get name() {
        return "Holiday Scheme Membership";
    }

    get canInstructionsOverlap() {
        return false;
    }

    async extendViewModel(ctx, vm) {
        let extendedViewModel = await super.extendViewModel(ctx, vm);
        let holidaySchemes = await apiWrapper.getAndExtractLinks(ctx, `Employer/${vm.EmployerId}/HolidaySchemes`);

        let selectedHolSchId = "";

        if (extendedViewModel.HolidayScheme){
            let href = extendedViewModel.HolidayScheme["@href"];
            let parts = href.split("/");    
            selectedHolSchId = parts[parts.length - 1];
        }

        extendedViewModel.HolidaySchemes = holidaySchemes.map(hs => {
            return {
                Id: hs.Id,
                Name: `${hs.SchemeName} - ${hs.SchemeKey}`,
                Checked: hs.Id === selectedHolSchId
            };
        });

        return extendedViewModel;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);
        let employerId = body.EmployerId;

        cleanBody.AllowNegativeBalance = (cleanBody.AllowNegativeBalance !== undefined && cleanBody.AllowNegativeBalance !== null && cleanBody.AllowNegativeBalance.toLowerCase() === "on");
        cleanBody.HolidayScheme = {
            "@href": `/Employer/${employerId}/HolidayScheme/${body.HolidayScheme}`
        };

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,

            AnnualEntitlementDays: cleanBody.AnnualEntitlementDays,
            MaxCarryOverDays: cleanBody.MaxCarryOverDays,
            AllowNegativeBalance: cleanBody.AllowNegativeBalance,
            SchemeJoinDate: cleanBody.SchemeJoinDate,
            SchemeExitDate: cleanBody.SchemeExitDate,
            AccrualType: cleanBody.AccrualType,
            HolidayScheme: cleanBody.HolidayScheme
        };
    }     
};