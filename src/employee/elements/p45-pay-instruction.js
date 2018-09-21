import { bindable, inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { HttpClient } from "aurelia-http-client";
import { Confirm } from "../../dialogs/confirm";

@customElement("p45-pay-instruction")
@inject(EventAggregator, ValidationControllerFactory, DialogService)
export class P45PayInstruction {
    constructor(EventAggregator, controllerFactory, dialogService) {
        this.ea = EventAggregator;
        this.validationController = controllerFactory.createForCurrentScope();
        this.dialogService = dialogService;
        this.client = new HttpClient();
    }

    @bindable employerid = null;
    @bindable employeeid = null;
    @bindable p45payinstruction = null;

    setupValidationRules() {
        ValidationRules
            .ensure("StartDate").required().withMessage("Start date is required")
            .ensure("TaxablePay").required().withMessage("Taxable pay is required")
            .ensure("TaxPaid").required().withMessage("Tax paid is required")
            .ensure("TaxCode").required().withMessage("Tax code is required")
            .ensure("LeavingDate").required().withMessage("Leaving date is required")
            .on(this.p45payinstruction);        
    }

    add() {
        this.p45payinstruction = {
            TaxBasis: "Cumulative",
            StudentLoan: "Off",
            PayFrequency: "Weekly"
        };
    }

    save() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                let data = {
                    StartDate: this.p45payinstruction.StartDate,
                    EndDate: this.p45payinstruction.EndDate,
                    Description: this.p45payinstruction.Description,                    
                    TaxablePay: this.p45payinstruction.TaxablePay,
                    TaxPaid: this.p45payinstruction.TaxPaid,
                    TaxCode: this.p45payinstruction.TaxCode,
                    TaxBasis: this.p45payinstruction.TaxBasis,
                    StudentLoan: this.p45payinstruction.StudentLoan,
                    PayFrequency: this.p45payinstruction.PayFrequency,
                    LeavingDate: this.p45payinstruction.LeavingDate,
                    PreviousEmployerPayeRef: this.p45payinstruction.PreviousEmployerPayeRef
                };
                let url = `/api/employer/${this.employerid}/Employee/${this.employeeid}/P45Instruction`;

                this.client.post(url, data).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        this.status = null;
                        return;
                    }

                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                });
            }
        });
    }

    delete() {
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this pay instruction?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                let employerId = this.employerid;
                let employeeId = this.employeeid;
                let payInstructionId = this.p45payinstruction.Id;
                let url = `/api/employer/${employerId}/employee/${employeeId}/payInstruction/${payInstructionId}`;
                
                this.client.delete(url).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.p45payinstruction = null;                    
                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                });
            }
        });
    }

    p45payinstructionChanged() {
        if (this.p45payinstruction) {
            this.setupValidationRules();
        }
    }
}