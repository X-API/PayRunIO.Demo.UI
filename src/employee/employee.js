import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { Router } from "aurelia-router";
import { Confirm } from "../dialogs/confirm";
import { PayInstructionModal } from "../pay-instruction/pay-instruction-modal";
import { BaseViewModel } from "../base-view-model";

@inject(EventAggregator, DialogService, Router)
export class Employee extends BaseViewModel {
    constructor(eventAggregator, dialogService, router) {
        super(router);

        this.employee = null;
        this.ea = eventAggregator;
        this.dialogService = dialogService;
        this.client = new HttpClient();

        this.typesOfPayInstruction = [
            "AoePayInstruction", 
            "BenefitPayInstruction", 
            "NiAdjustmentPayInstruction", 
            "NiPayInstruction", 
            "PensionPayInstruction", 
            "PrimitivePayInstruction", 
            "RatePayInstruction", 
            "SalaryPayInstruction",
            "ShppPayInstruction",
            "SspPayInstruction",
            "StudentLoanPayInstruction",
            "TaxPayInstruction"
        ];

        this.typesOfYTDPayInstruction = [
            "NiYtdPayInstruction", 
            "PensionYtdPayInstruction", 
            "PrimitiveYtdPayInstruction", 
            "SapYtdPayInstruction", 
            "ShppYtdPayInstruction", 
            "SmpYtdPayInstruction", 
            "SppYtdPayInstruction", 
            "SspYtdPayInstruction",
            "StudentLoanYtdPayInstruction",
            "TaxYtdPayInstruction"
        ];        
    }

    activate(params) {
        this.getPayInstructionTypes();

        $("html, body, ux-dialog-container, ux-dialog, ux-dialog-body").animate({
            scrollTop: 0
        }, 100);

        if (params && params.employerId && params.employeeId) {
            return this.getEmployeeDetails(params.employerId, params.employeeId);
        }
        else {
            this.employee = {
                EmployerId: params.employerId
            };
        }
    }

    attached() {
        if (this.employee) {
            super.setTitle(this.employee.Code);
        }
        else {
            super.setTitle("New Employee");
        }
    }
    
    deactivate() {
        if (this.reloadEmployeeSubscriber) {
            this.reloadEmployeeSubscriber.dispose();
        }
    }

    getEmployeeDetails(employerId, employeeId) {
        return new Promise(resolve => {
            this.ea.publish("request:processing");

            this.client.get(`/api/employer/${employerId}/employee/${employeeId}`).then(res => {
                this.ea.publish("request:complete");

                this.employee = JSON.parse(res.response);
                
                this.employee.EmployerId = employerId;

                resolve();
            });
        });
    }

    getPayInstructionTypes() {
        return new Promise(resolve => {
            this.ea.publish("request:processing");

            this.client.get("/api/pay-instructions").then(res => {
                this.ea.publish("request:complete");

                let response = JSON.parse(res.response);

                this.typesOfPayInstruction = response.filter(pi => pi.group === "normal");
                this.typesOfYTDPayInstruction = response.filter(pi => pi.group === "year-to-date");

                resolve();
            });
        });
    }

    openAddPayInstructionModal(piType) {
        let employerId = this.employee.EmployerId;
        let employeeId = this.employee.Id;
        let opts = {
            viewModel: PayInstructionModal,
            model: {
                type: piType,
                employerId: employerId,
                employeeId: employeeId
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                this.status = response.output;
                
                this.getEmployeeDetails(employerId, employeeId);
            }
        });
    }

    openEditPayInstructionModal(pi) {
        let employerId = this.employee.EmployerId;
        let employeeId = this.employee.Id;        
        let opts = {
            viewModel: PayInstructionModal,
            model: {
                id: pi.Id,
                employerId: employerId,
                employeeId: employeeId
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                this.status = response.output;

                this.getEmployeeDetails(employerId, employeeId);
            }
        });        
    }

    deleteInstruction(pi) {
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this pay instruction?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                let employerId = this.employee.EmployerId;
                let employeeId = this.employee.Id;
                let payInstructionId = pi.Id;
                let url = `/api/employer/${employerId}/employee/${employeeId}/payInstruction/${payInstructionId}`;
                
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
                    this.getEmployeeDetails(employerId, employeeId);
                });
            }
        });
    }
}