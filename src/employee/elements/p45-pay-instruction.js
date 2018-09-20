import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("p45-pay-instruction")
@inject(EventAggregator)
export class P45PayInstruction {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
    }

    attached() {
    }

    detached() {
    }
}