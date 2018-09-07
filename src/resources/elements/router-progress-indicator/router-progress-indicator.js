import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("router-progress-indicator")
@inject(EventAggregator)
export class RouterProgressIndicator {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
        this.visible = false;
    }
        
    attached() {
        this.processingSubscriber = this.ea.subscribe("router:navigation:processing", () => {
            NProgress.start();
        });

        this.completeSubscriber = this.ea.subscribe("router:navigation:complete", () => {
            NProgress.done();
        });        
    }

    detached() {
        this.processingSubscriber.dispose();
        this.completeSubscriber.dispose();
    }
}