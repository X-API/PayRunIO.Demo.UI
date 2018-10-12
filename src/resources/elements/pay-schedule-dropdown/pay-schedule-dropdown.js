import { bindable, customElement } from "aurelia-framework";

@customElement("pay-schedule-dropdown")
export class PayScheduleDropdown {
    @bindable payschedule = null;
    @bindable payschedules = null;
}