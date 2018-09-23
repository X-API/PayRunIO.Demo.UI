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
            $("div.status.alert").fadeIn();

            if (this.fadeTimeout) {
                window.clearTimeout(this.fadeTimeout);
            }
            
            this.fadeTimeout = window.setTimeout(() => {
                $("div.status.alert").fadeOut();
                this.status = null;
            }, 10000);
        }
    }
}