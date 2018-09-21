import { bindable, customElement } from "aurelia-framework";

@customElement("rule-exclusions")
export class RuleExclusions {
    @bindable ruleexclusions = null;
}