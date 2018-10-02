import { bindable, customElement } from "aurelia-framework";

@customElement("validation-errors")
export class ValidationErrors {
    @bindable errors = null;

    errorsChanged() {
        if (this.errors && this.errors.length > 0) {
            $("html, body").animate({
                scrollTop: $("#validation-errors-container").offset().top
            }, 500);
        }
    }    
}