const BaseInstruction = require("./BaseInstruction");

module.exports = class AoePayInstruction extends BaseInstruction {
    get name() {
        return "Attachment of Earnings";
    }

    get canInstructionsOverlap() {
        return true;
    }

    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (cleanBody.ClaimAdminFee && cleanBody.ClaimAdminFee.toLowerCase() === "on") {
            cleanBody.ClaimAdminFee = true;
        }
        else {
            cleanBody.ClaimAdminFee = false;
        }

        return {
            StartDate: cleanBody.StartDate,
            EndDate: cleanBody.EndDate,
            Description: cleanBody.Description,
            PayLineTag: cleanBody.PayLineTag,
            CaseNumber: cleanBody.CaseNumber,
            AoeType: cleanBody.AoeType,
            IssueDate: cleanBody.IssueDate,
            StopDate: cleanBody.StopDate,
            TotalToPay: cleanBody.TotalToPay,
            PreviousPayments: cleanBody.PreviousPayments,
            PreviousArrears: cleanBody.PreviousArrears,
            ClaimAdminFee: cleanBody.ClaimAdminFee,
            ProtectedEarningsAmount: cleanBody.ProtectedEarningsAmount,
            DeductionAmount: cleanBody.DeductionAmount,
            ProtectedEarningsPercentage: cleanBody.ProtectedEarningsPercentage,
            DeductionPercentage: cleanBody.DeductionPercentage
        };
    }
};