import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("api-calls")
@inject(EventAggregator)
export class APICalls {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
        this.visible = false;
    }

    attached() {
        this.toggleAPICallsSubscriber = this.ea.subscribe("toggleAPICalls", () => {
            this.visible = !this.visible;
        });
    }

    detached() {
        this.toggleAPICallsSubscriber.dispose();
    }

    close() {
        this.visible = false;
    }
}