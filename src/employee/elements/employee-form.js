import { bindable, inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { DialogService } from "aurelia-dialog";
import { Confirm } from "../../dialogs/confirm";

@customElement("employee-form")
@inject(EventAggregator, ValidationControllerFactory, DialogService)
export class EmployeeForm {
    constructor(EventAggregator, controllerFactory, dialogService) {
        this.ea = EventAggregator;
        this.paySchedules = null;
        this.client = new HttpClient();
        this.validationController = controllerFactory.createForCurrentScope();
        this.dialogService = dialogService;
        this.showSaveButton = true;
    }

    @bindable employee = null;

    attached() {
        this.setupTabEvents();
        this.setupValidationRules();        
    }

    detached() {
    }

    save() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                let url = `/api/employer/${this.employee.EmployerId}/employee`;
                let data = this.employee;

                this.ea.publish("request:processing");

                this.client.post(url, data).then(res => {
                    this.ea.publish("request:complete");

                    let parsedResponse = JSON.parse(res.response);

                    this.apiErrors = null;
                    this.status = null;

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.status = parsedResponse.status;
                    this.employee.Id = parsedResponse.employeeId;

                    this.ea.publish("employee:reload", {
                        employerId: this.employee.EmployerId,
                        employeeId: parsedResponse.employeeId
                    });
                });
            }
            else {
                $("html, body, ux-dialog-container, ux-dialog, ux-dialog-body").animate({
                    scrollTop: 0
                }, 500);                
            }
        });
    }

    employeeChanged() {
        if (!this.employee.HoursPerWeek) {
            this.employee.HoursPerWeek = 40;
        }

        if (!this.employee.EmployeePartner) {
            this.employee.EmployeePartner = {
                Title: "",
                FirstName: "",
                Initials: "",
                MiddleName: "",
                LastName: "",
                NiNumber: ""
            };
        }

        if (!this.paySchedules) {            
            let employerId = this.employee.EmployerId;

            this.ea.publish("request:processing");

            this.client.get(`/api/employer/${employerId}/pay-schedules`).then(res => {
                this.ea.publish("request:complete");

                this.paySchedules = JSON.parse(res.response);
            });
        }       
    }

    setupTabEvents() {
        $("a[data-toggle='tab']").on("shown.bs.tab", (e) => {
            this.showSaveButton = e.target.id !== "revisions-tab";
        });        
    }    

    setupValidationRules() {
        ValidationRules
            .ensure("LastName").required().withMessage("Last name is required")
            .ensure("Code").required().withMessage("Code is required")
            .ensure("EffectiveDate").required().withMessage("Effective date is required")
            .ensure("DateOfBirth").required().withMessage("Date of birth is required")
            .ensure("Gender").required().withMessage("Gender is required")
            .ensure("StarterDeclaration").required().withMessage("Starter declaration is required")
            .ensure("Territory").required().withMessage("Territory is required")
            .ensure("Region").required().withMessage("Region is required")
            .ensure("HoursPerWeek").required().withMessage("Hours per week is required")
            .ensure("AEAssessmentOverride").required().withMessage("AEAssessment override is required")
            .on(this.employee); 
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
                let employerId = this.employee.EmployerId;
                let employeeId = this.employee.Id;
                let effectiveDate = revision.EffectiveDate;
                let url = `/api/employer/${employerId}/employee/${employeeId}/revision/${effectiveDate}`;
                
                this.ea.publish("request:processing");

                this.client.delete(url).then(res => {
                    this.ea.publish("request:complete");
                    
                    let parsedResponse = JSON.parse(res.response);

                    this.apiErrors = null;
                    this.status = null;

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.status = parsedResponse.status;
                    this.employer.Revisions = this.employee.Revisions.filter(rev => rev.Revision !== revision.Revision);

                    this.ea.publish("employee:reload", {
                        employerId: employerId,
                        employeeId: employeeId
                    });                
                });                
            }
        });
    }    
}