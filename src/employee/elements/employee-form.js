import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("employee-form")
@inject(EventAggregator)
export class EmployeeForm {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
    }

    attached() {
    }

    detached() {
    }
}