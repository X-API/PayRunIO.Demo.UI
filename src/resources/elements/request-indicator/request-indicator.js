import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("request-indicator")
@inject(EventAggregator)
export class RequestIndicator {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
        this.visible = false;
    }
        
    attached() {
        this.processingSubscriber = this.ea.subscribe("request:processing", () => {
            this.visible = true;
        });

        this.completeSubscriber = this.ea.subscribe("request:complete", () => {
            this.visible = false;
        });
    }

    detached() {
        this.processingSubscriber.dispose();
        this.completeSubscriber.dispose();
    }
}