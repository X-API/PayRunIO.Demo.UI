import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { HttpClient } from "aurelia-http-client";

@inject(DialogController)
export class RtiTransactionModal {
    constructor(dialogController) {
        this.dialogController = dialogController;
        this.client = new HttpClient();
    }

    activate(state) {
        this.state = state;
        this.state.PayRun = state.payRuns[0];
        this.state.LateReason = "";
    }

    save() {
        let data = {
            Generate: true,
            Transmit: true,
            PayScheduleId: this.state.PayRun.PayScheduleKey,
            PayRunId: this.state.PayRun.PayRunKey,
            HoldingDate: this.state.HoldingDate,
            LateReason: this.state.LateReason
        };

        this.client.post(`/api/employer/${this.state.employerId}/rtiTransaction`, data).then(res => {
            let parsedResponse = JSON.parse(res.response);

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.dialogController.ok(parsedResponse.status);
        });
    }

    onLateReasonSelected(newValue) {
        this.state.LateReason = newValue;
    }
}