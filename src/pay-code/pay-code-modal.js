import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { HttpClient } from "aurelia-http-client";

@inject(ValidationControllerFactory, DialogController)
export class PayCodeModal {
    constructor(controllerFactory, dialogController) {
        this.dialogController = dialogController;
        this.validationController = controllerFactory.createForCurrentScope();
        this.client = new HttpClient();
    }

    activate(state) {
        this.state = state.payCode;

        this.nominalCodes = state.nominalCodes;

        this.territories = [
            { value: "UnitedKingdom", text: "United Kingdom" }
        ];

        this.regions = [
            { value: "NotSet", text: "Not set" },
            { value: "England", text: "England" },
            { value: "Scotland", text: "Scotland" }
        ];

        this.types = [
            { value: "Payment", text: "Payment" },
            { value: "Deduction", text: "Deduction" }
        ];
    }  

    save() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                this.client.post(`/api/employer/${this.state.employerId}/payCode`, this.state).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    this.apiErrors = null;

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.dialogController.ok(parsedResponse.status);
                });
            }
            else {
                $("html, body, ux-dialog-container, ux-dialog, ux-dialog-body").animate({
                    scrollTop: 0
                }, 500);                
            }
        });
    }
}