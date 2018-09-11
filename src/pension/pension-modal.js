import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { HttpClient } from "aurelia-http-client";

@inject(ValidationControllerFactory, DialogController)
export class PensionModal {
    constructor(controllerFactory, dialogController) {
        this.dialogController = dialogController;
        this.validationController = controllerFactory.createForCurrentScope();
        this.client = new HttpClient();
    }

    activate(state) {
        this.state = state;

        this.proRataMethods = [
            { value: "NotSet", text: "Not set" },
            { value: "Annual260Days", text: "Annual 260 days" },
            { value: "Annual365Days", text: "Annual 365 days" },
            { value: "AnnualQualifyingDays", text: "Annual qualifying days" },
            { value: "DaysPerCalenderMonth", text: "Days per calender month" },
            { value: "DaysPerTaxPeriod", text: "Days per tax period" },
        ];

        this.taxationMethods = [
            { value: "NotSet", text: "Not set" },
            { value: "NetBased", text: "Net based" },
            { value: "ReliefAtSource", text: "Relief at source" }
        ];

        this.setupValidationRules();
    }

    setupValidationRules() {
        ValidationRules
            .ensure("SchemeName").required().withMessage("Scheme name is required")
            .ensure("ProviderName").required().withMessage("Provider name is required")
            .ensure("ProviderEmployerRef").required().withMessage("Provider employer ref is required")
            .ensure("EffectiveDate").required().withMessage("Effective date is required")
            .on(this.state);        
    }    

    save() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                this.client.post(`/api/employer/${this.state.employerId}/pension`, this.state).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.dialogController.ok(parsedResponse.status);
                });
            }
        });
    }
}