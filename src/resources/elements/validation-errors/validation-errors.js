import { bindable, customElement } from "aurelia-framework";

@customElement("validation-errors")
export class ValidationErrors {
    @bindable errors = null;
}