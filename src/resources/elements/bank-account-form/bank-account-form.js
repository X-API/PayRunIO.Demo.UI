import { bindable, customElement } from "aurelia-framework";

@customElement("bank-account-form")
export class BankAccountForm {
    @bindable bankaccount = null;
}