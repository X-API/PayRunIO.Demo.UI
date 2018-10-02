import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { Router } from "aurelia-router";

@inject(DialogController, Router)
export class InfoModal {
    constructor(dialogController, router) {
        this.dialogController = dialogController;
        this.router = router;
    }

    activate(state) {
        this.state = state;
    }

    viewEmployee(employerId, employeeId) {
        this.router.navigateToRoute("employee", {
            employerId: employerId,
            employeeId: employeeId
        });

        this.dialogController.ok();
    }
}