import { bindable, customElement } from "aurelia-framework";

@customElement("api-errors")
export class ApiErrors {
    @bindable errors = null;
}