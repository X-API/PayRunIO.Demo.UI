import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(EventAggregator)
export class Header {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
    }

    attached() {
    }

    toggleAPICalls() {
        this.ea.publish("toggleAPICalls");
    }
}