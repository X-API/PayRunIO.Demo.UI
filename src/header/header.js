import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";

@inject(EventAggregator, Router)
export class Header {
    constructor(EventAggregator, router) {
        this.ea = EventAggregator;
        this.router = router;
    }

    attached() {
        this.showApiCallsButton = this.router.currentInstruction.config.auth;
    }

    toggleAPICalls() {
        this.ea.publish("toggleAPICalls");
    }
}