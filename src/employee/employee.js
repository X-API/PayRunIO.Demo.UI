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
        if (params && params.employerId && params.employeeId) {
            return this.getEmployeeDetails(params.employerId, params.employeeId);
        }
    }

    getEmployeeDetails(employerId, employeeId) {
        let client = new HttpClient();

        client.get(`/api/employer/${employerId}/employee/${employeeId}`).then(res => {
            this.employee = JSON.parse(res.response);
            
            this.employee.EmployerId = employerId;
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
                let client = new HttpClient();
                let employerId = this.employee.EmployerId;
                let employeeId = this.employee.Id;
                let payInstructionId = pi.Id;
                let url = `/api/employer/${employerId}/employee/${employeeId}/payInstruction/${payInstructionId}`;

                // /api/employer/:employerId/employee/:employeeId/payInstruction/:payInstructionId
                
                client.delete(url).then(res => {
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