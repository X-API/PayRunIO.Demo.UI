import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";

@inject(EventAggregator, DialogService)
export class Employee {
    constructor(eventAggregator, dialogService) {
        this.employee = null;
        this.ea = eventAggregator;
        this.dialogService = dialogService;
    }

    activate(params) {
        if (params && params.id) {
            return this.getEmployeeDetails(params.id);
        }
    }
}