import { bindable, inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { DialogService } from "aurelia-dialog";
import { Confirm } from "../dialogs/confirm";

@customElement("employer-form")
@inject(EventAggregator, ValidationControllerFactory, DialogService)
export class EmployerForm {
    constructor(EventAggregator, controllerFactory, dialogService) {
        this.validationSetup = false;

        this.ea = EventAggregator;
        this.client = new HttpClient();
        this.validationController = controllerFactory.createForCurrentScope();
        this.dialogService = dialogService;
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
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this revision?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                let employerId = this.employer.Id;
                let effectiveDate = revision.EffectiveDate;
                let url = `/api/employer/${employerId}/revision/${effectiveDate}`;
                
                this.client.delete(url).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                    this.employer.Revisions = this.employer.Revisions.filter(rev => rev.Revision !== revision.Revision);
                });                
            }
        });
    }
}