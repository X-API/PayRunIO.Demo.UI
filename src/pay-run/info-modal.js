import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@inject(DialogController)
export class InfoModal {
    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    activate(state) {
        this.state = state;
    }
}