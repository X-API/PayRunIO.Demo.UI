import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("employer-form")
@inject(EventAggregator)
export class EmployerForm {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
    }

    attached() {
    }

    detached() {
    }
}