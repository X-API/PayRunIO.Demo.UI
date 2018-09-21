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
    }

    @bindable employee = null;

    attached() {
    }

    detached() {
    }

    save() {
        console.log(this.employee);

        this.validationController.validate().then(result => {
            if (result.valid) {
                let url = `/api/employer/${this.employee.EmployerId}/employee`;
                let data = this.employee;

                this.client.post(url, data).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        this.status = null;
                        return;
                    }

                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                    this.employee.Id = parsedResponse.employeeId;

                    this.ea.publish("employee:reload");
                });                
            }
        });
    }

    employeeChanged() {
        if (!this.employee.HoursPerWeek) {
            this.employee.HoursPerWeek = 40;
        }

        if (!this.paySchedules) {
            this.setupValidationRules();
            
            let employerId = this.employee.EmployerId;

            this.client.get(`/api/employer/${employerId}/pay-schedules`).then(res => {
                this.paySchedules = JSON.parse(res.response);
            });
        }       
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
            .on(this.employee); 
    }
}