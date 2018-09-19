import { bindable, customElement } from "aurelia-framework";

@customElement("address-form")
export class AddressForm {
    @bindable address = null;

    addressChanged() {
        if (!this.address.Country) {
            this.address.Country = "United Kingdom";
        }
    }
}