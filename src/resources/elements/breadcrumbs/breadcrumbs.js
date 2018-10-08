import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";

@customElement("breadcrumbs")
@inject(EventAggregator, Router)
export class Breadcrumbs {
    constructor(eventAggregator, router) {
        this.ea = eventAggregator;
        this.router = router;
    }

    attached() {
        this.navigationSubscriber = this.ea.subscribe("router:navigation:success", () => {
            this.loadInstructions();
        });

        this.loadInstructions();
    }

    detached() {
        if (this.navigationSubscriber) {
            this.navigationSubscriber.dispose();
        }
    }

    loadInstructions() {
        let parentInstructions = this.getParentInstructions(this.router.currentInstruction);

        this.instructions = parentInstructions
            .slice(0, parentInstructions.length - 1)
            .concat(this.router.currentInstruction.getAllInstructions())
            .filter(instruction => instruction.config.includeInBreadcrumbs && instruction.config.title);
    }

    navigateToRoute(instruction) {
        this.router.navigateToRoute(instruction.config.name, instruction.params);
    }

    getParentInstructions(instruction) {
        let arr = [instruction];

        if (!instruction.config.previousInstruction) {
            return arr;
        }

        let routes = this.router.routes;
        let previousInstruction = routes.find(e => e.name === instruction.config.previousInstruction);

        if (!previousInstruction) {
            return arr;
        }

        previousInstruction.config = previousInstruction;

        return this.getParentInstructions(previousInstruction).concat(arr);
    }
}