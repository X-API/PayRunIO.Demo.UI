import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { HttpClient } from "aurelia-http-client";

@inject(DialogController)
export class JobDetailsModal {
    constructor(dialogController) {
        this.dialogController = dialogController;
        this.client = new HttpClient();
    }

    activate(state) {
        this.state = state;
    }
}