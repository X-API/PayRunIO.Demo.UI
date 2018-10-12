import { inject, bindable, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@customElement("status")
@inject(EventAggregator)
export class Status {
    constructor(eventAggregator) {
        this.ea = eventAggregator;
    }

    @bindable status = null;

    viewJob() {
        this.ea.publish("app:view-job", this.status.job);
    }

    statusChanged() {
        if (this.status) {
            $("#status").fadeIn();
            
            $("html, body, ux-dialog-container, ux-dialog, ux-dialog-body").animate({
                scrollTop: 0
            }, 500);
        }
    }
}