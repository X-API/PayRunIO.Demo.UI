import { bindable, customElement } from "aurelia-framework";

@customElement("api-errors")
export class ApiErrors {
    @bindable errors = null;

    errorsChanged() {
        if (this.errors) {
            $("html, body, ux-dialog-container, ux-dialog, ux-dialog-body").animate({
                scrollTop: 0
            }, 500);
        }
    }
}