import { bindable, customElement } from "aurelia-framework";

@customElement("status")
export class Status {
    @bindable status = null;
}