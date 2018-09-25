import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { Confirm } from "../dialogs/confirm";

@inject(EventAggregator, DialogService)
export class Employee {
    constructor(eventAggregator, dialogService) {
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

        if (params && params.employerId && params.employeeId) {
            return this.getEmployeeDetails(params.employerId, params.employeeId);
        }
        else {
            this.employee = {
                EmployerId: params.employerId
            };
        }
    }
    
    deactivate() {
        if (this.reloadEmployeeSubscriber) {
            this.reloadEmployeeSubscriber.dispose();
        }
    }

    getEmployeeDetails(employerId, employeeId) {
        return new Promise(resolve => {
            this.client.get(`/api/employer/${employerId}/employee/${employeeId}`).then(res => {
                this.employee = JSON.parse(res.response);
                
                this.employee.EmployerId = employerId;

                resolve();
            });
        });
    }

    getPayInstructionTypes() {
        return new Promise(resolve => {
            this.client.get("/api/pay-instructions").then(res => {
                let response = JSON.parse(res.response);

                this.typesOfPayInstruction = response.filter(pi => pi.group === "normal");
                this.typesOfYTDPayInstruction = response.filter(pi => pi.group === "year-to-date");

                resolve();
            });
        });
    }

    openAddPayInstructionModal(piType) {
    }

    openEditPayInstructionModal(pi) {
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
                
                this.client.delete(url).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                    this.getEmployeeDetails(employerId, employeeId);
                });
            }
        });
    }
}