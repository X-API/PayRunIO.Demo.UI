import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import * as nprogress from "nprogress";

@customElement("router-progress-indicator")
@inject(EventAggregator)
export class RouterProgressIndicator {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
    }
        
    attached() {
        this.processingSubscriber = this.ea.subscribe("router:navigation:processing", () => {
            nprogress.start();
        });

        this.completeSubscriber = this.ea.subscribe("router:navigation:complete", () => {
            nprogress.done();
        });        
    }

    detached() {
        this.processingSubscriber.dispose();
        this.completeSubscriber.dispose();
    }
}