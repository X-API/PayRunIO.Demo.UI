import { bindable, customElement } from "aurelia-framework";

@customElement("api-errors")
export class ApiErrors {
    @bindable errors = null;

    errorsChanged() {
        if (this.errors) {
            $("html, body").animate({
                scrollTop: $("#api-errors").offset().top
            }, 500);
        }
    }
}