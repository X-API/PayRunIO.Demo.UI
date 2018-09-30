import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { HttpClient } from "aurelia-http-client";

@inject(DialogController)
export class PayInstructionModal {
    constructor(dialogController) {
        this.dialogController = dialogController;
        this.client = new HttpClient();
    }

    activate(state) {
        return new Promise(resolve => {
            let apiUrl;

            if (state.id) {
                apiUrl = `/api/employer/${state.employerId}/employee/${state.employeeId}/payInstruction/${state.id}`;
            }
            else {
                apiUrl = `/api/employer/${state.employerId}/employee/${state.employeeId}/${state.type}`;
            }

            this.client.get(apiUrl).then(res => {
                this.pi = JSON.parse(res.response);

                resolve();
            });
        });
    } 

    save() {
        let data = this.pi;

        this.client.post(`/api/employer/${this.state.employerId}/paySchedule`, data).then(res => {
            let parsedResponse = JSON.parse(res.response);

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.dialogController.ok(parsedResponse.status);
        });
    }

    getPayInstructionPartial(pi) {
        if (pi.InstructionType.trim().toLowerCase().indexOf("ytd") != -1) {
            return `./ytd-pay-instructions/forms/${pi.InstructionType}.html`;
        }

        return `./pay-instructions/forms/${pi.InstructionType}.html`;
    }
}