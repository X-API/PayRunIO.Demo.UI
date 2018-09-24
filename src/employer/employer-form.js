import { bindable, inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";

@customElement("employer-form")
@inject(EventAggregator, ValidationControllerFactory)
export class EmployerForm {
    constructor(EventAggregator, controllerFactory) {
        this.validationSetup = false;

        this.ea = EventAggregator;
        this.client = new HttpClient();
        this.validationController = controllerFactory.createForCurrentScope();
    }

    @bindable employer = null;

    attached() {
        if (!this.employer) {
            this.employer = {
                Territory: "UnitedKingdom",
                Region: "NotSet"
            };
        }

        this.setupValidationRules();        
    }

    detached() {
    }

    save() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                this.client.post("/api/Employer", this.employer).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        this.status = null;
                        return;
                    }

                    this.apiErrors = null;
                    this.status = parsedResponse.status;

                    this.ea.publish("employer:reload", {
                        employerId: parsedResponse.employerId
                    });            
                });
            }
        });
    }

    setupValidationRules() {
        ValidationRules
            .ensure("Name").required().withMessage("Details > Name is required")
            .ensure("EffectiveDate").required().withMessage("Details > Effective date is required")
            .on(this.employer); 
    }    

    deleteRevision(revision) {
        console.log("deleteRevision()", revision);
    }
}