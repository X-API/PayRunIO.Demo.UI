import { bindable, inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";

@customElement("employee-form")
@inject(EventAggregator, ValidationControllerFactory)
export class EmployeeForm {
    constructor(EventAggregator, controllerFactory) {
        this.ea = EventAggregator;
        this.paySchedules = null;
        this.client = new HttpClient();
        this.validationController = controllerFactory.createForCurrentScope();
        this.showSaveButton = true;
    }

    @bindable employee = null;

    attached() {
    }

    detached() {
    }

    save() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                let url = `/api/employer/${this.employee.EmployerId}/employee`;
                let data = this.employee;

                this.client.post(url, data).then(res => {
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
            this.setupTabEvents();
            this.setupValidationRules();
            
            let employerId = this.employee.EmployerId;

            this.client.get(`/api/employer/${employerId}/pay-schedules`).then(res => {
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
}