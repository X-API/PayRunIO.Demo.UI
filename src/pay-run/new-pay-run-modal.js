import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { HttpClient } from "aurelia-http-client";

@inject(ValidationControllerFactory, DialogController)
export class NewPayRunModal {
    constructor(controllerFactory, dialogController) {
        this.dialogController = dialogController;
        this.validationController = controllerFactory.createForCurrentScope();
        this.client = new HttpClient();
    }

    activate(state) {
        this.state = state;

        this.setupValidationRules();
    }

    setupValidationRules() {
        ValidationRules
            .ensure("PayScheduleId").required().withMessage("Pay Schedule is required")
            .ensure("PaymentDate").required().withMessage("Payment Date is required")
            .ensure("StartDate").required().withMessage("Pay Period Start is required")
            .ensure("EndDate").required().withMessage("Pay Period End is required")
            .on(this.state);        
    }    

    save() {
        let data = {
            PayScheduleId: this.state.PayScheduleId,
            PaymentDate: this.state.PaymentDate,
            StartDate: this.state.StartDate,
            EndDate: this.state.EndDate
        };

        this.validationController.validate().then(result => {
            if (result.valid) {
                this.client.post(`/api/employer/${this.state.EmployerId}/payRun`, data).then(res => {
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