import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { HttpClient } from "aurelia-http-client";

@inject(ValidationControllerFactory, DialogController)
export class AddPayScheduleModal {
    constructor(controllerFactory, dialogController) {
        this.dialogController = dialogController;
        this.validationController = controllerFactory.createForCurrentScope();
        this.client = new HttpClient();
    }

    activate(state) {
        this.state = state;
        this.frequencies = [
            { text: "Weekly", value: "Weekly" },
            { text: "Monthly", value: "Monthly" },
            { text: "Two weekly", value: "TwoWeekly" },
            { text: "Four weekly", value: "FourWeekly" }
        ];

        this.setupValidationRules();
    }

    setupValidationRules() {
        ValidationRules
            .ensure("Name").required().withMessage("Name is required")
            .ensure("PayFrequency").required().withMessage("Pay Frequency is required")
            .on(this.state);        
    }    

    save() {
        let data = {
            Id: this.state.Key,
            Name: this.state.Name,
            PayFrequency: this.state.PayFrequency
        };

        this.validationController.validate().then(result => {
            if (result.valid) {
                this.client.post(`/api/employer/${this.state.employerId}/paySchedule`, data).then(res => {
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