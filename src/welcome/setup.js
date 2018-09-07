import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { Router } from "aurelia-router";

@inject(ValidationControllerFactory, Router)
export class Setup {
    constructor(controllerFactory, router) {
        this.controller = controllerFactory.createForCurrentScope();
        this.router = router;
        this.client = new HttpClient();
    }

    activate() {
        this.client.get("/api/setup").then(data => {
            this.state = JSON.parse(data.response);
            this.environments = ["Test", "Production"];

            this.setupValidationRules();
        });
    }

    setupValidationRules() {
        ValidationRules
            .ensure("ConsumerSecret").required().withMessage("Consumer Secret is required")
            .ensure("ConsumerKey").required().withMessage("Consumer Key is required")
            .ensure("Environment").required().withMessage("Environment is required")
            .on(this.state);
    }

    save() {
        let data = {
            Environment: this.state.Environment,
            ConsumerKey: this.state.ConsumerKey,
            ConsumerSecret: this.state.ConsumerSecret
        };

        this.controller.validate().then(result => {
            if (result.valid) {
                this.client.post("/api/setup", data).then(() => {
                    this.router.navigate("employers");
                });
            }
        });  
    }    
}